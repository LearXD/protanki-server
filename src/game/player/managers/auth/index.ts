import { Player } from "../..";
import { ResourceType } from "../../../../managers/resources";
import { SetIncorrectPasswordPopupPacket } from "../../../../network/packets/incorrect-password";
import { Packet } from "../../../../network/packets/packet";
import { SendLoginPacket } from "../../../../network/packets/send-login";
import { SetAchievementCCPacket } from "../../../../network/packets/set-achievement-cc";
import { SetBattleInviteCCPacket } from "../../../../network/packets/set-battle-invite-cc";
import { SetEmailInfoPacket } from "../../../../network/packets/set-email-info";
import { LayoutState } from "../../../../utils/game/layout-state";
import { IPlayerAuthData } from "./types";

export class PlayerAuthManager {

    private data: IPlayerAuthData;
    private authenticated: boolean = false;

    constructor(
        private readonly player: Player
    ) { }

    public isAuthenticated() { return this.authenticated }

    public sendIncorrectPasswordPopup() {
        this.player.sendPacket(new SetIncorrectPasswordPopupPacket());
    }

    public sendUserEmail() {
        const setEmailInfoPacket = new SetEmailInfoPacket();
        setEmailInfoPacket.email = this.data.email;
        setEmailInfoPacket.confirmed = this.data.emailConfirmed;
        this.player.sendPacket(setEmailInfoPacket);
    }

    private async handleAuthenticated() {
        this.authenticated = true;

        this.player.setUsername(this.data.username);
        this.player.getDataManager().loadData();

        this.player.sendGameLoaded();
        this.player.setLayoutState(LayoutState.BATTLE_SELECT);

        this.player.getDataManager().sendPremiumData();
        this.player.getDataManager().sendUserProperty();
        this.player.getServer().getLocaleManager().sendLocaleConfig(this.player)

        this.sendUserEmail();

        // TODO: see this packet latter
        const setBattleInviteCCPacket = new SetBattleInviteCCPacket();
        setBattleInviteCCPacket.resourceId = 106777
        this.player.sendPacket(setBattleInviteCCPacket);

        this.player.getServer().getFriendsManager().sendFriendsData(this.player);

        this.player.getServer().getResourcesManager().sendResources(this.player, ResourceType.LOBBY);
        this.player.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)

        const setAchievementCCPacket = new SetAchievementCCPacket();
        setAchievementCCPacket.achievements = ['FIRST_RANK_UP'];
        this.player.sendPacket(setAchievementCCPacket);

        this.player.getServer().getBattlesManager().sendBattleSelectScreen(this.player);
    }

    public handleLoginPacket(packet: SendLoginPacket) {
        const data = this.player.getServer().getAuthManager()
            .getPlayerData(packet.username);

        if (!data) {
            this.sendIncorrectPasswordPopup();
            return;
        }

        this.data = data;
        this.handleAuthenticated();

        return true;
    }

    public handlePacket(packet: Packet) {

        if (packet instanceof SendLoginPacket) {
            this.handleLoginPacket(packet)
            return true
        }

        return false;
    }
}