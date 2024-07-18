import { Player } from "../..";
import { ResourceType } from "../../../../managers/resources";
import { SetIncorrectPasswordPopupPacket } from "../../../../network/packets/set-incorrect-password-popup";
import { Packet } from "../../../../network/packets/packet";
import { SendLoginPacket } from "../../../../network/packets/send-login";
import { SetAchievementsPacket } from "../../../../network/packets/set-achievements";
import { SetBattleInviteCCPacket } from "../../../../network/packets/set-battle-invite-cc";
import { SetEmailInfoPacket } from "../../../../network/packets/set-email-info";
import { LayoutState } from "../../../../utils/game/layout-state";
import { IPlayerAuthData } from "./types";
import { SendRegisterCheckUsernamePacket } from "../../../../network/packets/send-register-check-username";
import { SetRegisterUsernameAvailablePacket } from "../../../../network/packets/set-register-username-available";
import { SetRegisterUsernameAlreadyUsedPacket } from "../../../../network/packets/set-register-username-already-used";
import { SetAdvisedUsernamesPacket } from "../../../../network/packets/set-advised-usernames";
import { Achievement } from "../../../../utils/game/achievement";

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

        this.sendUserEmail();

        this.player.getServer().getLocaleManager().sendLocaleConfig(this.player)

        this.player.getBattlesManager().sendBattleInviteSound();

        this.player.getFriendsManager().sendFriendsData();
        this.player.getFriendsManager().sendInviteFriendsProperties()

        this.player.getServer().getResourcesManager().sendResources(this.player, ResourceType.LOBBY);
        this.player.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)

        this.player.getDataManager().sendAchievements();

        this.player.getBattlesManager().sendBattleSelectScreen();
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

        if (packet instanceof SendRegisterCheckUsernamePacket) {
            if (packet.username === 'LearXD') {
                this.player.sendPacket(new SetRegisterUsernameAvailablePacket())
                return true
            }

            this.player.sendPacket(new SetRegisterUsernameAlreadyUsedPacket())

            const setAdvisedUsernamesPacket = new SetAdvisedUsernamesPacket();
            setAdvisedUsernamesPacket.usernames = ['LearXD', 'LearXD1', 'LearXD2', 'LearXD3', 'LearXD4']
            this.player.sendPacket(setAdvisedUsernamesPacket)

            return true;
        }

        return false;
    }
}