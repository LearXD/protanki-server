import { Player } from "../../game/player";
import { SetAuthResourcesPacket } from "../../network/packets/set-auth-resources";
import { SetInviteEnabledPacket } from "../../network/packets/set-invite-enabled";
import { Server } from "../../server";
import { SetNetworkParamsPacket } from "../../network/packets/set-network-params";
import { SocialNetwork } from "../../utils/game/social-network";
import { ResolveFullLoadedPacket } from "../../network/packets/resolve-full-loaded";
import { IAuthConfig } from "./types";

export class AuthManager {

    private config: IAuthConfig

    constructor(
        private readonly server: Server
    ) {
        this.config = server.getAssetsManager().getData('auth.json')

        if (!this.config) {
            throw new Error('Auth config not found!')
        }
    }

    public sendAuthConfig(client: Player) {
        const socialNetworksPacket = new SetNetworkParamsPacket();
        socialNetworksPacket.socialParams = SocialNetwork.NETWORKS;
        client.sendPacket(socialNetworksPacket);

        const setInviteEnabledPacket = new SetInviteEnabledPacket();
        setInviteEnabledPacket.inviteEnabled = this.server.isWhitelisted();
        client.sendPacket(setInviteEnabledPacket);

        const setAuthResourcesPacket = new SetAuthResourcesPacket();

        setAuthResourcesPacket.bgResource = this.config.bgResource
        setAuthResourcesPacket.enableRequiredEmail = this.config.enableRequiredEmail
        setAuthResourcesPacket.maxPasswordLength = this.config.maxPasswordLength
        setAuthResourcesPacket.minPasswordLength = this.config.minPasswordLength
        client.sendPacket(setAuthResourcesPacket);

        this.sendAuthScreen(client)
    }

    public sendAuthScreen(client: Player) {
        const resolveFullLoadedPacket = new ResolveFullLoadedPacket();
        client.sendPacket(resolveFullLoadedPacket);
    }
}