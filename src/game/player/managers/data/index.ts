import { ServerError } from "@/server/utils/error";
import { Player } from "../..";
import { SetAchievementsPacket } from "../../../../network/packets/set-achievements";
import { SetCrystalsPacket } from "../../../../network/packets/set-crystals";
import { SetPremiumDataPacket } from "../../../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../../../network/packets/set-premium-left-time";
import { SetScorePacket } from "../../../../network/packets/set-score";
import { SetUserPropertyPacket } from "../../../../network/packets/set-user-property";
import { SetWelcomeToPremiumPacket } from "../../../../network/packets/set-welcome-to-premium";
import { Achievement } from "../../../../states/achievement";
import { Logger } from "../../../../utils/logger";
import { PlayerData } from "../../utils/data";
import { RankManager } from "@/server/managers/rank";

export class PlayerDataManager {

    constructor(
        private readonly player: Player
    ) { }

    public load(username: string) {

        Logger.info(`Loading data for player username`);

        if (!this.player.auth.authenticated) {
            throw new ServerError('Trying to load data for an unauthenticated player', username);
        }

        this.player.data = PlayerData.findPlayerData(username, this.player);
        this.player.data.loadGarage()
    }

    public sendCrystals() {
        const setCrystals = new SetCrystalsPacket();
        setCrystals.crystals = this.player.data.crystals
        this.player.sendPacket(setCrystals);
    }

    public sendScore() {
        const packet = new SetScorePacket();
        packet.score = this.player.data.experience
        this.player.sendPacket(packet);
    }

    public sendWelcomeToPremium(renew: boolean = false) {
        const setWelcomeToPremiumPacket = new SetWelcomeToPremiumPacket();
        setWelcomeToPremiumPacket.renew = renew;
        this.player.sendPacket(setWelcomeToPremiumPacket);
    }

    public sendPremiumData() {
        const data = this.player.data.getPremiumData()

        const setPremiumDataPacket = new SetPremiumDataPacket()
        setPremiumDataPacket.needShowNotificationCompletionPremium = data.showReminder
        setPremiumDataPacket.needShowWelcomeAlert = data.showWelcome
        setPremiumDataPacket.reminderCompletionPremiumTime = data.reminderTime
        setPremiumDataPacket.wasShowAlertForFirstPurchasePremium = !data.showReminder
        setPremiumDataPacket.wasShowReminderCompletionPremium = !data.showWelcome
        setPremiumDataPacket.lifeTimeInSeconds = data.lifeTime

        if (data.showWelcome) {
            // TODO: Verificar se o usuario realmente é novo ou renovacao
            this.sendWelcomeToPremium();
        }

        if (data.leftTime > 0) {
            this.sendPremiumLeftTime();
        }

        this.player.sendPacket(setPremiumDataPacket);
    }

    public sendPremiumLeftTime() {
        const data = this.player.data.getPremiumData()

        const setPremiumLeftTimePacket = new SetPremiumLeftTimePacket();
        setPremiumLeftTimePacket.leftTimeInSeconds = data.leftTime;

        this.player.sendPacket(setPremiumLeftTimePacket);
    }

    public sendAchievements() {
        const setAchievementCCPacket = new SetAchievementsPacket();
        setAchievementCCPacket.achievements = [
            Achievement.FIRST_RANK_UP,
            Achievement.FIRST_PURCHASE,
            Achievement.SET_EMAIL,
            Achievement.FIGHT_FIRST_BATTLE,
            Achievement.FIRST_DONATE
        ];
        this.player.sendPacket(setAchievementCCPacket);
    }


    public sendUserProperty() {
        const rank = RankManager.getRank(RankManager.getRankByExperience(this.player.data.experience));

        const setUserPropertyPacket = new SetUserPropertyPacket();
        setUserPropertyPacket.crystals = this.player.data.crystals
        setUserPropertyPacket.durationCrystalAbonement = this.player.data.getDoubleCrystalsLeftTime();
        setUserPropertyPacket.hasDoubleCrystal = this.player.data.hasDoubleCrystals();
        setUserPropertyPacket.place = 0;
        setUserPropertyPacket.currentRankScore = rank.experience;
        setUserPropertyPacket.rank = rank.rank;
        setUserPropertyPacket.score = this.player.data.experience;
        setUserPropertyPacket.nextRankScore = RankManager.getNextRankScore(this.player.data.experience);
        setUserPropertyPacket.rating = 1;
        setUserPropertyPacket.serverNumber = 1;
        setUserPropertyPacket.uid = this.player.getName();
        setUserPropertyPacket.userProfileUrl = '';

        this.player.sendPacket(setUserPropertyPacket);
    }
}