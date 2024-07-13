import { Player } from "../..";
import { Logger } from "../../../../utils/logger";

import { IPlayerProfileData, IPremiumData } from "./types";

export class PlayerDataManager {

    private profile: IPlayerProfileData;

    constructor(
        private readonly player: Player
    ) { }

    public load() {

        Logger.info(`Loading data for player ${this.player.getUsername()}`);

        if (this.player.getAuthManager().isAuthenticated()) {
            throw new Error('Trying to load data for an unauthenticated player');
        }

        this.profile = {
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
        const data = this.profile.premium;

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

    public getCrystals() { return this.profile.crystals }
    public decreaseCrystals(amount: number) { this.profile.crystals -= amount }
    public increaseCrystals(amount: number) { this.profile.crystals += amount }
    public setCrystals(amount: number) { this.profile.crystals = amount }

    public getRank() { return this.profile.rank }
    public getScore() { return this.profile.score }
}