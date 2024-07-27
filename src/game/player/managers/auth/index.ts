import { Player } from "../..";
import { ResourceType } from "../../../../managers/resources";
import { SetIncorrectPasswordPopupPacket } from "../../../../network/packets/set-incorrect-password-popup";
import { Packet } from "../../../../network/packets/packet";
import { SendLoginPacket } from "../../../../network/packets/send-login";
import { SetEmailInfoPacket } from "../../../../network/packets/set-email-info";
import { LayoutState } from "../../../../states/layout-state";
import { SendRegisterCheckUsernamePacket } from "../../../../network/packets/send-register-check-username";
import { SetRegisterUsernameAvailablePacket } from "../../../../network/packets/set-register-username-available";
import { SetRegisterUsernameAlreadyUsedPacket } from "../../../../network/packets/set-register-username-already-used";
import { SetAdvisedUsernamesPacket } from "../../../../network/packets/set-advised-usernames";
import { IPlayerAuthData } from "../../utils/data/types";
import { PlayerData } from "../../utils/data";
import { SendRegisterPacket } from "../../../../network/packets/send-register";

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

        this.player.getDataManager().load(this.data.username);
        this.player.getServer().getPlayersManager().addPlayer(this.player);

        this.player.sendGameLoaded();
        this.player.setLayoutState(LayoutState.BATTLE_SELECT);

        this.player.getDataManager().sendPremiumData();
        this.player.getDataManager().sendUserProperty();

        this.sendUserEmail();

        this.player.getServer().getLocaleManager().sendLocaleConfig(this.player)

        this.player.getBattlesManager().sendBattleInviteSound();

        this.player.getFriendsManager().sendFriendsData();

        await this.player.getServer().getResourcesManager().sendResources(this.player, ResourceType.LOBBY);
        this.player.setSubLayoutState(LayoutState.BATTLE_SELECT)

        this.player.getDataManager().sendAchievements();
        this.player.getFriendsManager().sendInviteFriendsProperties()

        this.player.getBattlesManager().sendBattleSelectScreen();
    }

    public handleLoginPacket(packet: SendLoginPacket) {
        const data = PlayerData.findPlayerAuthData(packet.username);

        if (!data) {
            this.sendIncorrectPasswordPopup();
            return;
        }

        this.data = data;
        this.handleAuthenticated();

        return true;
    }

    public handleRegisterPacket(packet: SendRegisterPacket) {
        const data = PlayerData.findPlayerAuthData(packet.username);

        if (data) {
            this.player.sendPacket(new SetRegisterUsernameAlreadyUsedPacket())
            return;
        }

        this.data = PlayerData.createPlayerData(packet.username, packet.password);
        this.handleAuthenticated();
    }

    public handlePacket(packet: Packet) {

        if (packet instanceof SendLoginPacket) {
            this.handleLoginPacket(packet)
        }

        if (packet instanceof SendRegisterPacket) {
            this.handleRegisterPacket(packet)
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
        }
    }
}