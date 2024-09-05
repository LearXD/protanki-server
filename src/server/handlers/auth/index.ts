import { Player } from "../../../game/player";
import { SetAuthResourcesPacket } from "../../../network/packets/set-auth-resources";
import { SetInviteEnabledPacket } from "../../../network/packets/set-invite-enabled";
import { Server } from "../..";
import { SetNetworkParamsPacket } from "../../../network/packets/set-network-params";
import { SetAuthScreenPacket } from "../../../network/packets/set-auth-screen";
import { IAuthConfig } from "./types";
import { ServerError } from "@/server/utils/error";

export class AuthManager {

    private config: IAuthConfig

    constructor(
        private readonly server: Server
    ) {
        this.config = server.assets.getData('auth.json')

        if (!this.config) {
            throw new ServerError('Auth config not found!')
        }
    }

    public sendAuthConfig(client: Player) {
        const socialNetworksPacket = new SetNetworkParamsPacket();
        socialNetworksPacket.socialParams = [
            {
                authorizationUrl: 'https://learxd.dev',
                snId: 'vkontakte'
            },
            {
                authorizationUrl: 'https://learxd.dev',
                snId: 'google'
            }
        ]
        client.sendPacket(socialNetworksPacket);

        const setInviteEnabledPacket = new SetInviteEnabledPacket();
        setInviteEnabledPacket.inviteEnabled = this.server.whitelisted;
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
        client.sendPacket(new SetAuthScreenPacket());
    }
}