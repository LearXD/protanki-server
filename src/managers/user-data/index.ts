import { Client } from "../../game/client";
import { Player } from "../../game/player";
import { SetNotificationEnabledPacket } from "../../network/packets/set-notification-enabled";
import { SetOpenConfigPacket } from "../../network/packets/set-open-config";
import { SetSocialNetworkPanelCCPacket } from "../../network/packets/set-social-network-panel-cc";
import { SetUserOnlinePacket } from "../../network/packets/set-user-online";
import { SetUserPremiumDataPacket } from "../../network/packets/set-user-premium-data";
import { SetUserRankPacket } from "../../network/packets/set-user-rank";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class UserDataManager {

    constructor(
        private readonly server: Server
    ) { }


    public handleRequestUserData(client: Client, query: string) {
        // TODO: Get data from database
        const setUserOnlinePacket = new SetUserOnlinePacket(new ByteArray());
        setUserOnlinePacket.online = false;
        setUserOnlinePacket.serverNumber = 1;
        setUserOnlinePacket.user = query;
        client.sendPacket(setUserOnlinePacket);

        const setUserRankPacket = new SetUserRankPacket(new ByteArray());
        setUserRankPacket.rank = 30;
        setUserRankPacket.user = query;
        client.sendPacket(setUserRankPacket);

        const setUserPremiumPacket = new SetUserPremiumDataPacket(new ByteArray());
        setUserPremiumPacket.premiumTimeLeftInSeconds = 1e9;
        setUserPremiumPacket.user = query;
        client.sendPacket(setUserPremiumPacket);
    }

    public handleSendConfigData(client: Player) {
        const setSocialNetworkPanelCCPacket = new SetSocialNetworkPanelCCPacket(new ByteArray());
        setSocialNetworkPanelCCPacket.passwordCreated = true;
        setSocialNetworkPanelCCPacket.socialNetworkParams = [
            {
                authorizationUrl: 'https://oauth.vk.com/authorize?client_id=7889475&response_type=code&display=page&redirect_uri=http://146.59.110.195:8090/externalEntrance/vkontakte/?session=5462395157697881312',
                linkExists: false,
                snId: 0
            },
            { authorizationUrl: null, linkExists: true, snId: 1802464884 }
        ]
        client.sendPacket(setSocialNetworkPanelCCPacket);

        const setNotificationEnabledPacket = new SetNotificationEnabledPacket(new ByteArray());
        setNotificationEnabledPacket.enabled = true;
        client.sendPacket(setNotificationEnabledPacket);
    }

    public handleOpenConfig(client: Player) {
        const setOpenConfigPacket = new SetOpenConfigPacket(new ByteArray());
        client.sendPacket(setOpenConfigPacket);
    }

    public handleSetShowNotifications(client: Player, enabled: boolean) {
        // TODO: Implement
    }

    public handleSetShowDamageIndicator(client: Player, enabled: boolean) {
        // TODO: Implement
    }
}