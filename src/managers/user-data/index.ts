import { Client } from "../../game/client";
import { UserData } from "../../game/user-data";
import { SetPremiumDataPacket } from "../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../network/packets/set-premium-left-time";
import { SetUserPropertyPacket } from "../../network/packets/set-user-property";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class UserDataManager {

    constructor(
        private readonly server: Server
    ) { }

    public getUserData(client: Client): UserData {
        const user = UserData.findByUsername(client.getUsername());
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    public getPremiumData(client: Client) {
        return this.getUserData(client)
            .getPremiumData();
    }

    public sendPremiumLeftTime(client: Client) {
        const data = this.getPremiumData(client);

        const setPremiumLeftTimePacket = new SetPremiumLeftTimePacket(new ByteArray());
        setPremiumLeftTimePacket.leftTimeInSeconds = data.leftTime;

        client.sendPacket(setPremiumLeftTimePacket);
    }

    public sendPremiumData(client: Client) {
        const data = this.getPremiumData(client);

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
        setUserPropertyPacket.durationCrystalAbonement = data.getGarage().durationCrystalAbonement;
        setUserPropertyPacket.hasDoubleCrystal = data.getGarage().hasDoubleCrystal;
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

    public handleAuthenticated(client: Client) {
        this.sendPremiumData(client);
        this.server.getLocaleManager()
            .sendLocaleConfig(client)
        this.sendUserProperty(client);
    }
}