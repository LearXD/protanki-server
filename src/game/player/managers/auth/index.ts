import { Player } from "../..";

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
import { ResourceType } from "../../../../server/managers/resources/types";
import { SendLoginHashPacket } from "@/network/packets/send-login-hash";
import { SetWrongLoginHashPacket } from "@/network/packets/set-wrong-login-hash";
import { SetLoginSuccessfulPacket } from "@/network/packets/set-login-successful";

export class PlayerAuthManager {

    private data: IPlayerAuthData;
    public authenticated: boolean = false;

    constructor(
        private readonly player: Player
    ) { }

    public sendIncorrectPasswordPopup() {
        this.player.sendPacket(new SetIncorrectPasswordPopupPacket());
    }

    public sendLoginSuccessful() {
        const setGameLoadedPacket = new SetLoginSuccessfulPacket();
        this.player.sendPacket(setGameLoadedPacket);
    }

    public sendUserEmail() {
        const setEmailInfoPacket = new SetEmailInfoPacket();
        setEmailInfoPacket.email = this.data.email;
        setEmailInfoPacket.confirmed = this.data.emailConfirmed;
        this.player.sendPacket(setEmailInfoPacket);
    }

    private async onAuthenticate() {
        this.authenticated = true;

        this.player.dataManager.load(this.data.username);
        this.player.server.players.addPlayer(this.player);

        this.sendLoginSuccessful();
        this.player.setLayoutState(LayoutState.BATTLE_SELECT);

        this.player.dataManager.sendPremiumData();
        this.player.dataManager.sendUserProperty();

        this.sendUserEmail();

        this.player.server.locale.sendLocaleConfig(this.player)

        this.player.battles.sendBattleInviteSound();

        this.player.friends.sendFriendsData();

        await this.player.server.resources.sendResources(this.player, ResourceType.LOBBY);
        this.player.setSubLayoutState(LayoutState.BATTLE_SELECT)

        this.player.dataManager.sendAchievements();
        this.player.friends.sendInviteFriendsProperties()

        this.player.battles.sendBattleSelectScreen();

    }

    public handleLoginPacket(packet: SendLoginPacket) {
        const data = PlayerData.findByUsername(packet.username);

        // TODO: CORRIGIR
        if (!data || data.data !== packet.password) {
            this.sendIncorrectPasswordPopup();
            return;
        }

        // this.data = data;
        this.onAuthenticate();

        return true;
    }

    public handleRegisterPacket(packet: SendRegisterPacket) {
        const data = PlayerData.findPlayerAuthData(packet.username);

        if (data) {
            this.player.sendPacket(new SetRegisterUsernameAlreadyUsedPacket())
            return;
        }

        this.data = PlayerData.createPlayerData(packet.username, packet.password);
        this.onAuthenticate();
    }

    public handlePacket(packet: Packet) {

        if (packet instanceof SendLoginPacket) {
            this.handleLoginPacket(packet)
        }

        if (packet instanceof SendRegisterPacket) {
            this.handleRegisterPacket(packet)
        }

        if (packet instanceof SendLoginHashPacket) {
            this.player.sendPacket(new SetWrongLoginHashPacket())
        }

        if (packet instanceof SendRegisterCheckUsernamePacket) {
            const found = PlayerData.profiles.find(p => p.username === packet.username);

            if (!found) {
                this.player.sendPacket(new SetRegisterUsernameAvailablePacket())
                return true
            }

            this.player.sendPacket(new SetRegisterUsernameAlreadyUsedPacket())

            const setAdvisedUsernamesPacket = new SetAdvisedUsernamesPacket();
            const subNames = ['_1', '_2', '_3', '_4', '_5']
            setAdvisedUsernamesPacket.usernames = Array.from({ length: 5 }, (_, i) => found.username + "_" + subNames[i])
            this.player.sendPacket(setAdvisedUsernamesPacket)
        }
    }
}