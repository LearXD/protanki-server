import bcrypt from "bcrypt";

import { Client } from "../../game/client";
import { SetAuthResourcesPacket } from "../../network/packets/set-auth-resources";
import { SetInviteEnabledPacket } from "../../network/packets/set-invite-enabled";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";
import { SetEmailInfoPacket } from "../../network/packets/set-email-info";
import { SetBattleInviteCCPacket } from "../../network/packets/set-battle-invite-cc";
import { SetFriendsDataPacket } from "../../network/packets/set-friends-data";
import { LayoutState } from "../../utils/game/layout-state";
import { SetChatInitParamsPacket } from "../../network/packets/set-chat-init-params";
import { SetChatCostPacket } from "../../network/packets/set-chat-cost";
import { SetAchievementCCPacket } from "../../network/packets/set-achievement-cc";
import { SetChatMessagesPacket } from "../../network/packets/set-chat-messages";
import { SetViewingBattlePacket } from "../../network/packets/set-viewing-battle";
import { SetViewingBattleDataPacket } from "../../network/packets/set-viewing-battle-data";
import { SetBattleListPacket } from "../../network/packets/set-battle-list";
import { SetMapsDataPacket } from "../../network/packets/set-maps-data";
import { ResourceType } from "../../managers/resources";

export class AuthHandler {

    private static readonly RESOURCES = {
        bgResource: 122842,
        enableRequiredEmail: false,
        maxPasswordLength: 100,
        minPasswordLength: 6
    }

    constructor(
        private readonly server: Server
    ) { }

    public getUserEmailInfo() {
        return {
            email: 'contato@learxd.dev',
            confirmed: true
        }
    }

    public sendUserEmail(client: Client) {
        const data = this.getUserEmailInfo();

        const setEmailInfoPacket = new SetEmailInfoPacket(new ByteArray());
        setEmailInfoPacket.email = data.email;
        setEmailInfoPacket.confirmed = data.confirmed;

        client.sendPacket(setEmailInfoPacket);
    }

    public sendAuthConfig(client: Client) {
        const setInviteEnabledPacket = new SetInviteEnabledPacket(new ByteArray());
        setInviteEnabledPacket.inviteEnabled = this.server.isWhitelisted();
        client.sendPacket(setInviteEnabledPacket);

        const setAuthResourcesPacket = new SetAuthResourcesPacket(new ByteArray());

        setAuthResourcesPacket.bgResource = AuthHandler.RESOURCES.bgResource
        setAuthResourcesPacket.enableRequiredEmail = AuthHandler.RESOURCES.enableRequiredEmail
        setAuthResourcesPacket.maxPasswordLength = AuthHandler.RESOURCES.maxPasswordLength
        setAuthResourcesPacket.minPasswordLength = AuthHandler.RESOURCES.minPasswordLength

        client.sendPacket(setAuthResourcesPacket);
    }

    private async handleClientAuthenticated(client: Client) {
        await this.server.getResourcesManager().sendResources(client, ResourceType.LOBBY);
        client.sendGameLoaded();

        client.setLayoutState(LayoutState.BATTLE_SELECT);
        client.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)

        this.server.getUserDataManager().handleAuthenticated(client);
        this.sendUserEmail(client);

        // TODO: see this packet latter
        const setBattleInviteCCPacket = new SetBattleInviteCCPacket(new ByteArray());
        setBattleInviteCCPacket.resourceId = 106777
        client.sendPacket(setBattleInviteCCPacket);

        this.server.getFriendsManager().sendFriendsData(client);

        this.server.getChatManager().sendChatConfig(client);
        this.server.getChatManager().sendChatMessages(client);

        const setAchievementCCPacket = new SetAchievementCCPacket(new ByteArray());
        setAchievementCCPacket.achievements = ['FIRST_RANK_UP', 'FIRST_PURCHASE', 'SET_EMAIL'];
        client.sendPacket(setAchievementCCPacket);

        this.server.getMapsManager().sendMapsData(client);
        this.server.getBattlesManager().sendBattles(client);

    }

    public handleLogin(
        client: Client,
        username: string,
        password: string,
        remember: boolean
    ) {
        // const hash = bcrypt.hashSync(password, 10);
        client.setUsername(username)
        this.handleClientAuthenticated(client);
    }

}