import { Client } from "../../game/client";
import { UserData } from "../../game/user-data";
import { SetNotificationEnabledPacket } from "../../network/packets/set-notification-enabled";
import { SetOpenConfigPacket } from "../../network/packets/set-open-config";
import { SetPremiumDataPacket } from "../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../network/packets/set-premium-left-time";
import { SetSocialNetworkPanelCCPacket } from "../../network/packets/set-social-network-panel-cc";
import { SetSuppliesPacket } from "../../network/packets/set-supplies";
import { SetUserOnlinePacket } from "../../network/packets/set-user-online";
import { SetUserPremiumDataPacket } from "../../network/packets/set-user-premium-data";
import { SetUserPropertyPacket } from "../../network/packets/set-user-property";
import { SetUserRankPacket } from "../../network/packets/set-user-rank";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class UserDataManager {

    constructor(
        private readonly server: Server
    ) { }

    public handleAuthenticated(client: Client) {
        this.sendPremiumData(client);

        this.server.getLocaleManager()
            .sendLocaleConfig(client)

        this.sendUserProperty(client);
    }

    public getUserData(client: Client): UserData {
        const user = UserData.findByUsername(client.getUsername());
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    public sendPremiumLeftTime(client: Client) {
        const data = this.getUserData(client).getPremiumData();

        const setPremiumLeftTimePacket = new SetPremiumLeftTimePacket(new ByteArray());
        setPremiumLeftTimePacket.leftTimeInSeconds = data.leftTime;

        client.sendPacket(setPremiumLeftTimePacket);
    }

    public sendPremiumData(client: Client) {
        const data = this.getUserData(client).getPremiumData();

        const setPremiumDataPacket = new SetPremiumDataPacket(new ByteArray())
        setPremiumDataPacket.needShowNotificationCompletionPremium = data.showReminder
        setPremiumDataPacket.needShowWelcomeAlert = data.showWelcome
        setPremiumDataPacket.reminderCompletionPremiumTime = 1247525376
        setPremiumDataPacket.wasShowAlertForFirstPurchasePremium = !data.showWelcome;
        setPremiumDataPacket.wasShowReminderCompletionPremium = !data.showReminder;
        setPremiumDataPacket.lifeTimeInSeconds = data.lifeTime;

        if (data.enabled) {
            this.sendPremiumLeftTime(client);
        }

        client.sendPacket(setPremiumDataPacket);
    }

    public sendUserProperty(client: Client) {
        const data = this.getUserData(client);

        const setUserPropertyPacket = new SetUserPropertyPacket(new ByteArray());

        setUserPropertyPacket.crystals = data.getCrystals();
        setUserPropertyPacket.currentRankScore = 1000;
        setUserPropertyPacket.durationCrystalAbonement = data.getData().durationCrystalAbonement;
        setUserPropertyPacket.hasDoubleCrystal = data.getData().hasDoubleCrystal;
        setUserPropertyPacket.nextRankScore = 100000
        setUserPropertyPacket.place = data.getRating().place;
        setUserPropertyPacket.rank = data.getRank().rank;
        setUserPropertyPacket.rating = data.getRating().rating;
        setUserPropertyPacket.score = data.getScore();
        setUserPropertyPacket.serverNumber = 1;
        setUserPropertyPacket.uid = data.getUsername();
        setUserPropertyPacket.userProfileUrl = 'http://ratings.generaltanks.com/pt_br/user/';

        client.sendPacket(setUserPropertyPacket);
    }

    public sendSupplies(client: Client) {
        const supplies = this.getUserData(client).getSupplies();
        const setSuppliesPacket = new SetSuppliesPacket(new ByteArray());

        let slotId = 1;
        for (const [supply, count] of Object.entries(supplies)) {
            setSuppliesPacket.supplies.push({
                count,
                id: supply,
                itemEffectTime: 0,
                itemRestSec: 0,
                slotId: slotId++
            });
        }

        client.sendPacket(setSuppliesPacket);
    }

    public handleRequestUserData(client: Client, query: string) {
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

    public handleSendConfigData(client: Client) {
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

    public handleOpenConfig(client: Client) {
        const setOpenConfigPacket = new SetOpenConfigPacket(new ByteArray());
        client.sendPacket(setOpenConfigPacket);
    }

    public handleSetShowNotifications(client: Client, enabled: boolean) {
        // TODO: Implement
    }

    public handleSetShowDamageIndicator(client: Client, enabled: boolean) {
        // TODO: Implement
    }
}