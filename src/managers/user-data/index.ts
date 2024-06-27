import { Client } from "../../game/client";
import { SetPremiumDataPacket } from "../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../network/packets/set-premium-left-time";
import { SetUserPropertyPacket } from "../../network/packets/set-user-property";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class UserDataManager {
    constructor(
        private readonly server: Server
    ) { }

    public getPremiumData(client: Client) {
        return {
            activated: true,
            leftTime: -1,
            lifeTime: -1,
        }
    }

    public getUserData(client: Client) {
        return {
            crystals: 1000000,
            currentRankScore: 1,
            durationCrystalAbonement: -1,
            hasDoubleCrystal: false,
            nextRankScore: 1000,
            place: 1,
            rank: 30,
            rating: 1,
            score: 999,
            serverNumber: 1,
            uid: client.getUsername(),
            userProfileUrl: '',
        }
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
        setPremiumDataPacket.needShowNotificationCompletionPremium = false
        setPremiumDataPacket.needShowWelcomeAlert = false
        setPremiumDataPacket.reminderCompletionPremiumTime = 1247525376
        setPremiumDataPacket.wasShowAlertForFirstPurchasePremium = true;
        setPremiumDataPacket.wasShowReminderCompletionPremium = true
        setPremiumDataPacket.lifeTimeInSeconds = -1

        client.sendPacket(setPremiumDataPacket);
    }

    public sendUserProperty(client: Client) {
        const data = this.getUserData(client);

        const setUserPropertyPacket = new SetUserPropertyPacket(new ByteArray());

        setUserPropertyPacket.crystals = data.crystals
        setUserPropertyPacket.currentRankScore = data.currentRankScore;
        setUserPropertyPacket.durationCrystalAbonement = data.durationCrystalAbonement;
        setUserPropertyPacket.hasDoubleCrystal = data.hasDoubleCrystal;
        setUserPropertyPacket.nextRankScore = data.nextRankScore;
        setUserPropertyPacket.place = data.place;
        setUserPropertyPacket.rank = data.rank;
        setUserPropertyPacket.rating = data.rating;
        setUserPropertyPacket.score = data.score;
        setUserPropertyPacket.serverNumber = data.serverNumber;
        setUserPropertyPacket.uid = data.uid;
        setUserPropertyPacket.userProfileUrl = data.userProfileUrl;

        client.sendPacket(setUserPropertyPacket);
    }

    public handleAuthenticated(client: Client) {
        this.sendPremiumData(client);
        this.sendUserProperty(client);
    }
}