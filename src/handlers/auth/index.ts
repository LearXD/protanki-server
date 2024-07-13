import { Player } from "../../game/player";
import { SetAuthResourcesPacket } from "../../network/packets/set-auth-resources";
import { SetInviteEnabledPacket } from "../../network/packets/set-invite-enabled";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";
import { SetEmailInfoPacket } from "../../network/packets/set-email-info";
import { SetBattleInviteCCPacket } from "../../network/packets/set-battle-invite-cc";
import { LayoutState } from "../../utils/game/layout-state";
import { SetAchievementCCPacket } from "../../network/packets/set-achievement-cc";
import { ResourceType } from "../../managers/resources";
import { SetNetworkParamsPacket } from "../../network/packets/set-network-params";
import { SocialNetwork } from "../../utils/game/social-network";
import { ResolveFullLoadedPacket } from "../../network/packets/resolve-full-loaded";
import { Client } from "../../game/client";
import { SendLoginPacket } from "../../network/packets/send-login";

export class AuthManager {

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

    public sendUserEmail(client: Player) {
        const data = this.getUserEmailInfo();

        const setEmailInfoPacket = new SetEmailInfoPacket(new ByteArray());
        setEmailInfoPacket.email = data.email;
        setEmailInfoPacket.confirmed = data.confirmed;

        client.sendPacket(setEmailInfoPacket);
    }

    public sendAuthConfig(client: Player) {
        const socialNetworksPacket = new SetNetworkParamsPacket(new ByteArray());
        socialNetworksPacket.socialParams = SocialNetwork.NETWORKS;
        client.sendPacket(socialNetworksPacket);

        const setInviteEnabledPacket = new SetInviteEnabledPacket(new ByteArray());
        setInviteEnabledPacket.inviteEnabled = this.server.isWhitelisted();
        client.sendPacket(setInviteEnabledPacket);

        const setAuthResourcesPacket = new SetAuthResourcesPacket(new ByteArray());

        setAuthResourcesPacket.bgResource = AuthManager.RESOURCES.bgResource
        setAuthResourcesPacket.enableRequiredEmail = AuthManager.RESOURCES.enableRequiredEmail
        setAuthResourcesPacket.maxPasswordLength = AuthManager.RESOURCES.maxPasswordLength
        setAuthResourcesPacket.minPasswordLength = AuthManager.RESOURCES.minPasswordLength

        client.sendPacket(setAuthResourcesPacket);

        this.sendAuthScreen(client)
    }

    private async handleClientAuthenticated(client: Player) {

        client.getDataManager().load();

        client.sendGameLoaded();

        client.setLayoutState(LayoutState.BATTLE_SELECT);

        this.server.getUserDataManager().handleAuthenticated(client);

        this.sendUserEmail(client);

        // TODO: see this packet latter
        const setBattleInviteCCPacket = new SetBattleInviteCCPacket(new ByteArray());
        setBattleInviteCCPacket.resourceId = 106777
        client.sendPacket(setBattleInviteCCPacket);

        this.server.getFriendsManager().sendFriendsData(client);

        this.server.getResourcesManager().sendResources(client, ResourceType.LOBBY);
        client.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)

        const setAchievementCCPacket = new SetAchievementCCPacket(new ByteArray());
        setAchievementCCPacket.achievements = ['FIRST_RANK_UP'];
        client.sendPacket(setAchievementCCPacket);

        this.server.getBattlesManager().sendBattleSelectScreen(client);
    }

    public sendAuthScreen(client: Player) {
        const resolveFullLoadedPacket = new ResolveFullLoadedPacket(new ByteArray());
        client.sendPacket(resolveFullLoadedPacket);
    }

    public handleLoginPacket(client: Player, packet: SendLoginPacket) {
        // const hash = bcrypt.hashSync(password, 10);
        client.setUsername(packet.username)
        this.handleClientAuthenticated(client);
        return true;
    }

}