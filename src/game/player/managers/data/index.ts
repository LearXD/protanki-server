import { Player } from "../..";
import { SetAchievementsPacket } from "../../../../network/packets/set-achievements";
import { SetCrystalsPacket } from "../../../../network/packets/set-crystals";
import { SetPremiumDataPacket } from "../../../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../../../network/packets/set-premium-left-time";
import { SetUserPropertyPacket } from "../../../../network/packets/set-user-property";
import { Logger } from "../../../../utils/logger";
import { PlayerData } from "../../utils/data";

export class PlayerDataManager {

    constructor(
        private readonly player: Player
    ) { }

    public loadData(username: string) {

        Logger.info(`Loading data for player username`);

        if (!this.player.getAuthManager().isAuthenticated()) {
            throw new Error('Trying to load data for an unauthenticated player');
        }

        this.player.setData(PlayerData.loadPlayerData(username));
    }

    public sendCrystals() {
        const setCrystals = new SetCrystalsPacket();
        setCrystals.crystals = this.player.getData().getCrystals();
        this.player.sendPacket(setCrystals);
    }

    public sendPremiumData() {
        const data = this.player.getData().getPremiumData()

        const setPremiumDataPacket = new SetPremiumDataPacket()
        setPremiumDataPacket.needShowNotificationCompletionPremium = data.showReminder
        setPremiumDataPacket.needShowWelcomeAlert = data.showWelcome
        setPremiumDataPacket.reminderCompletionPremiumTime = 10
        setPremiumDataPacket.wasShowAlertForFirstPurchasePremium = !data.showReminder
        setPremiumDataPacket.wasShowReminderCompletionPremium = !data.showWelcome
        setPremiumDataPacket.lifeTimeInSeconds = data.leftTime

        if (this.player.getData().getProfileData().premium.endAt > Date.now()) {
            this.sendPremiumLeftTime();
        }

        this.player.sendPacket(setPremiumDataPacket);
    }

    public sendPremiumLeftTime() {
        const data = this.player.getData().getPremiumData()

        const setPremiumLeftTimePacket = new SetPremiumLeftTimePacket();
        setPremiumLeftTimePacket.leftTimeInSeconds = data.leftTime;

        this.player.sendPacket(setPremiumLeftTimePacket);
    }

    public sendAchievements() {
        const setAchievementCCPacket = new SetAchievementsPacket();
        setAchievementCCPacket.achievements = [
            // Achievement.FIRST_RANK_UP,
            // Achievement.FIRST_PURCHASE,
            // Achievement.SET_EMAIL,
            // Achievement.FIGHT_FIRST_BATTLE,
            // Achievement.FIRST_DONATE
        ];
        this.player.sendPacket(setAchievementCCPacket);
    }


    public sendUserProperty() {
        const setUserPropertyPacket = new SetUserPropertyPacket();

        setUserPropertyPacket.crystals = this.player.getData().getCrystals();
        setUserPropertyPacket.currentRankScore = 1000;
        setUserPropertyPacket.durationCrystalAbonement = this.player.getData().getProfileData().durationCrystalAbonement;
        setUserPropertyPacket.hasDoubleCrystal = this.player.getData().hasDoubleCrystal();
        setUserPropertyPacket.nextRankScore = 100000
        setUserPropertyPacket.place = 0;
        setUserPropertyPacket.rank = this.player.getData().getRank();
        setUserPropertyPacket.rating = 1;
        setUserPropertyPacket.score = this.player.getData().getScore();
        setUserPropertyPacket.serverNumber = 1;
        setUserPropertyPacket.uid = this.player.getUsername();
        setUserPropertyPacket.userProfileUrl = '';

        this.player.sendPacket(setUserPropertyPacket);
    }
}