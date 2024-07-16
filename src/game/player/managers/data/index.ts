import { Player } from "../..";
import { SetPremiumDataPacket } from "../../../../network/packets/set-premium-data";
import { SetPremiumLeftTimePacket } from "../../../../network/packets/set-premium-left-time";
import { SetUserPropertyPacket } from "../../../../network/packets/set-user-property";
import { Logger } from "../../../../utils/logger";

import { IPlayerProfileData, IPremiumData } from "./types";

export class PlayerDataManager {

    private data: IPlayerProfileData;

    constructor(
        private readonly player: Player
    ) { }

    public loadData() {

        Logger.info(`Loading data for player ${this.player.getUsername()}`);

        if (!this.player.getAuthManager().isAuthenticated()) {
            throw new Error('Trying to load data for an unauthenticated player');
        }

        this.data = {
            crystals: 100000000,
            hasDoubleCrystal: false,
            durationCrystalAbonement: 48602763,
            rank: 30,
            score: 2000,
            premium: {
                notified: false,
                startedAt: Date.now(),
                endAt: Date.now()
            }
        }
    }


    public getAuthData(username: string) {
        return { username: username, password: 'suasenha123' }
    }

    public getPremiumData(): IPremiumData {
        const data = this.data.premium;

        const lifeTime = (data.endAt - data.startedAt) / 1000;
        const leftTime = (data.endAt - Date.now()) / 1000;

        return {
            enabled: leftTime > 0,
            showReminder: false,
            showWelcome: leftTime > 0 && !data.notified,
            reminderTime: Date.now(),
            leftTime: leftTime > 0 ? leftTime : -1,
            lifeTime: lifeTime
        }
    }

    public getCrystals() { return this.data.crystals }

    public decreaseCrystals(amount: number) { this.data.crystals -= amount }
    public increaseCrystals(amount: number) { this.data.crystals += amount }

    public setCrystals(amount: number) { this.data.crystals = amount }
    public hasDoubleCrystal() { return this.data.hasDoubleCrystal }

    public getRank() { return this.data.rank }
    public getScore() { return this.data.score }

    public sendPremiumData() {
        const setPremiumDataPacket = new SetPremiumDataPacket()
        setPremiumDataPacket.needShowNotificationCompletionPremium = true
        setPremiumDataPacket.needShowWelcomeAlert = true
        setPremiumDataPacket.reminderCompletionPremiumTime = 1247525376
        setPremiumDataPacket.wasShowAlertForFirstPurchasePremium = false;
        setPremiumDataPacket.wasShowReminderCompletionPremium = true;
        setPremiumDataPacket.lifeTimeInSeconds = 0;

        if (this.data.premium.endAt > Date.now()) {
            this.sendPremiumLeftTime();
        }

        this.player.sendPacket(setPremiumDataPacket);
    }

    public sendPremiumLeftTime() {
        const setPremiumLeftTimePacket = new SetPremiumLeftTimePacket();
        setPremiumLeftTimePacket.leftTimeInSeconds = 0;

        this.player.sendPacket(setPremiumLeftTimePacket);
    }


    public sendUserProperty() {
        const setUserPropertyPacket = new SetUserPropertyPacket();

        setUserPropertyPacket.crystals = this.data.crystals;
        setUserPropertyPacket.currentRankScore = 1000;
        setUserPropertyPacket.durationCrystalAbonement = this.data.durationCrystalAbonement;
        setUserPropertyPacket.hasDoubleCrystal = this.data.hasDoubleCrystal;
        setUserPropertyPacket.nextRankScore = 100000
        setUserPropertyPacket.place = 0;
        setUserPropertyPacket.rank = this.data.rank;
        setUserPropertyPacket.rating = 1;
        setUserPropertyPacket.score = this.data.score;
        setUserPropertyPacket.serverNumber = 1;
        setUserPropertyPacket.uid = this.player.getUsername();
        setUserPropertyPacket.userProfileUrl = '';

        this.player.sendPacket(setUserPropertyPacket);
    }
}