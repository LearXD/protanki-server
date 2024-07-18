import { ChatModeratorLevel } from "../../../../utils/game/chat-moderator-level";
import { Rank } from "../../../../utils/game/rank";
import { IPlayerAuthData, IPlayerProfileData, IPremiumData } from "./types";

export class PlayerData {

    private profileData: IPlayerProfileData;

    public constructor(
        private readonly username: string
    ) { }

    public getProfileData() {
        return this.profileData;
    }

    public static loadAuthData(username: string): IPlayerAuthData {
        return {
            username: username,
            password: 'suasenha123',
            email: 'contato@learxd.dev',
            emailConfirmed: true
        }
    }

    public static loadPlayerData(
        username: string,
        loadGarage: boolean = false
    ) {
        const data = new PlayerData(username);
        const loaded = data.loadProfileData();

        if (!loaded) {
            return null;
        }

        return data;
    }

    public loadProfileData() {
        if (this.username === 'PiuRap') {
            this.profileData = {
                crystals: 2000,
                moderatorLevel: ChatModeratorLevel.MODERATOR,
                hasDoubleCrystal: true,
                durationCrystalAbonement: 0,
                rank: Rank.BRIGADIER,
                score: 2000,
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now() + 1000 * 60 * 10
                }
            }
            return true;
        }

        if (this.username === 'TheUnknown') {
            this.profileData = {
                crystals: 1000,
                moderatorLevel: ChatModeratorLevel.COMMUNITY_MANAGER,
                hasDoubleCrystal: false,
                durationCrystalAbonement: 48602763,
                rank: Rank.GENERALISSIMO,
                score: 2000,
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now()
                }
            }
            return true;
        }
        return false;

    }

    public getUsername() { return this.username }

    public isAdmin() {
        return this.profileData.moderatorLevel === ChatModeratorLevel.COMMUNITY_MANAGER
    }

    public getModeratorLevel() { return this.profileData.moderatorLevel }

    public getCrystals() { return this.profileData.crystals }

    public decreaseCrystals(amount: number) { this.profileData.crystals -= amount }
    public increaseCrystals(amount: number) { this.profileData.crystals += amount }

    public setCrystals(amount: number) { this.profileData.crystals = amount }
    public hasDoubleCrystal() { return this.profileData.hasDoubleCrystal }

    public getRank() { return this.profileData.rank }
    public getScore() { return this.profileData.score }

    public getPremiumData(): IPremiumData {
        const data = this.profileData.premium;

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
}