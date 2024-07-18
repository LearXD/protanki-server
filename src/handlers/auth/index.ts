import { Player } from "../../game/player";
import { SetAuthResourcesPacket } from "../../network/packets/set-auth-resources";
import { SetInviteEnabledPacket } from "../../network/packets/set-invite-enabled";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";
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
        const socialNetworksPacket = new SetNetworkParamsPacket(new ByteArray());
        socialNetworksPacket.socialParams = SocialNetwork.NETWORKS;
        client.sendPacket(socialNetworksPacket);

        const setInviteEnabledPacket = new SetInviteEnabledPacket(new ByteArray());
        setInviteEnabledPacket.inviteEnabled = this.server.isWhitelisted();
        client.sendPacket(setInviteEnabledPacket);

        const setAuthResourcesPacket = new SetAuthResourcesPacket(new ByteArray());

        setAuthResourcesPacket.bgResource = this.config.bgResource
        setAuthResourcesPacket.enableRequiredEmail = this.config.enableRequiredEmail
        setAuthResourcesPacket.maxPasswordLength = this.config.maxPasswordLength
        setAuthResourcesPacket.minPasswordLength = this.config.minPasswordLength
        client.sendPacket(setAuthResourcesPacket);

        this.sendAuthScreen(client)
    }

    public sendAuthScreen(client: Player) {
        const resolveFullLoadedPacket = new ResolveFullLoadedPacket(new ByteArray());
        client.sendPacket(resolveFullLoadedPacket);
    }
}