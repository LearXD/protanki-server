import { Client } from "@/game/client";
import { Player } from "@/game/player";
import { PlayerData } from "@/game/player/utils/data";
import { SetNotificationEnabledPacket } from "@/network/packets/set-notification-enabled";
import { SetOpenConfigPacket } from "@/network/packets/set-open-config";
import { SetSocialNetworkPanelCCPacket } from "@/network/packets/set-social-network-panel-cc";
import { SetUserOnlinePacket } from "@/network/packets/set-user-online";
import { SetUserPremiumDataPacket } from "@/network/packets/set-user-premium-data";
import { SetUserRankPacket } from "@/network/packets/set-user-rank";
import { Server } from "@/server";


export class UserDataManager {

    constructor(
        private readonly server: Server
    ) { }

    public findPlayerData(username: string) {
        const player = this.server.playersManager.getPlayer(username);

        if (player) {
            return player.data;
        }

        return PlayerData.findPlayerData(username);
    }


    public handleRequestUserData(client: Client, username: string) {
        const data = this.findPlayerData(username);

        const setUserOnlinePacket = new SetUserOnlinePacket();
        setUserOnlinePacket.online = true;
        setUserOnlinePacket.serverNumber = 1;
        setUserOnlinePacket.user = username;
        client.sendPacket(setUserOnlinePacket);

        const setUserRankPacket = new SetUserRankPacket();
        setUserRankPacket.rank = data.getRank();
        setUserRankPacket.user = username;
        client.sendPacket(setUserRankPacket);

        const setUserPremiumPacket = new SetUserPremiumDataPacket();
        setUserPremiumPacket.premiumTimeLeftInSeconds = data.getPremiumData().leftTime;
        setUserPremiumPacket.user = username;
        client.sendPacket(setUserPremiumPacket);

        const premiumData = data.getPremiumData();
        if (premiumData.enabled) {
            const setPremiumDataPacket = new SetUserPremiumDataPacket();
            setPremiumDataPacket.premiumTimeLeftInSeconds = premiumData.leftTime;
            setPremiumDataPacket.user = username;
            client.sendPacket(setPremiumDataPacket);
        }
    }

    public handleSendConfigData(client: Player) {
        const setSocialNetworkPanelCCPacket = new SetSocialNetworkPanelCCPacket();
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

        const setNotificationEnabledPacket = new SetNotificationEnabledPacket();
        setNotificationEnabledPacket.enabled = true;
        client.sendPacket(setNotificationEnabledPacket);
    }

    public handleOpenConfig(client: Player) {
        const setOpenConfigPacket = new SetOpenConfigPacket();
        client.sendPacket(setOpenConfigPacket);
    }

    public handleSetShowNotifications(client: Player, enabled: boolean) {
        // TODO: Implement
    }

    public handleSetShowDamageIndicator(client: Player, enabled: boolean) {
        // TODO: Implement
    }
}