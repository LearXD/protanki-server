import { Player } from "../..";
import { SetAchievementsPacket } from "../../../../network/packets/set-achievements";
import { SetCrystalsPacket } from "../../../../network/packets/set-crystals";
import { SetPremiumDataPacket } from "../../../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../../../network/packets/set-premium-left-time";
import { SetScorePacket } from "../../../../network/packets/set-score";
import { SetUserPropertyPacket } from "../../../../network/packets/set-user-property";
import { SetWelcomeToPremiumPacket } from "../../../../network/packets/set-welcome-to-premium";
import { Achievement } from "../../../../utils/game/achievement";
import { Logger } from "../../../../utils/logger";
import { PlayerData } from "../../utils/data";

export class PlayerDataManager {

    constructor(
        private readonly player: Player
    ) { }

    public load(username: string) {

        Logger.info(`Loading data for player username`);

        if (!this.player.getAuthManager().isAuthenticated()) {
            throw new Error('Trying to load data for an unauthenticated player');
        }

        this.player.setData(PlayerData.findPlayerData(username, true));
    }

    public sendCrystals() {
        const setCrystals = new SetCrystalsPacket();
        setCrystals.crystals = this.player.getData().getCrystals();
        this.player.sendPacket(setCrystals);
    }

    public sendScore() {
        const packet = new SetScorePacket();
        packet.score = this.player.getData().getScore();
        this.player.sendPacket(packet);
    }

    public sendWelcomeToPremium(renew: boolean = false) {
        const setWelcomeToPremiumPacket = new SetWelcomeToPremiumPacket();
        setWelcomeToPremiumPacket.renew = renew;
        this.player.sendPacket(setWelcomeToPremiumPacket);
    }

    public sendPremiumData() {
        const data = this.player.getData().getPremiumData()

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
        const data = this.player.getData().getPremiumData()

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
        const setUserPropertyPacket = new SetUserPropertyPacket();

        setUserPropertyPacket.crystals = this.player.getData().getCrystals();
        setUserPropertyPacket.currentRankScore = 1000;
        setUserPropertyPacket.durationCrystalAbonement = this.player.getData().getDoubleCrystalsLeftTime();
        setUserPropertyPacket.hasDoubleCrystal = this.player.getData().hasDoubleCrystals();
        setUserPropertyPacket.nextRankScore = 100000
        setUserPropertyPacket.place = 0;
        setUserPropertyPacket.rank = this.player.getData().getRank();
        setUserPropertyPacket.rating = 1;
        setUserPropertyPacket.score = this.player.getData().getScore();
        setUserPropertyPacket.serverNumber = 1;
        setUserPropertyPacket.uid = this.player.getUsername();
        setUserPropertyPacket.userProfileUrl = 'http://ratings.generaltanks.com/pt_br/user/';

        this.player.sendPacket(setUserPropertyPacket);
    }
}