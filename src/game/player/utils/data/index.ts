import { ChatModeratorLevel } from "../../../../utils/game/chat-moderator-level";
import { Rank } from "../../../../utils/game/rank";
import { IPlayerAuthData, IPlayerGarageData, IPlayerProfileData, IPremiumData } from "./types";

export class PlayerData {

    private profileData: IPlayerProfileData;
    private garageData: IPlayerGarageData;

    public constructor(
        private readonly username: string
    ) { }

    public static findPlayerData(
        username: string,
        loadGarage: boolean = false
    ) {
        const data = new PlayerData(username);
        const loaded = data.loadProfile();

        if (!loaded) {
            return null;
        }

        if (loadGarage) {
            data.loadGarage();
        }

        return data;
    }

    public static findPlayerAuthData(username: string): IPlayerAuthData {
        return {
            username: username,
            password: 'suasenha123',
            email: 'contato@learxd.dev',
            emailConfirmed: true
        }
    }

    public loadProfile() {
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

    public loadGarage() {
        this.garageData = {
            paintings: [
                { name: 'green', equipped: false },
                { name: 'africa', equipped: true },
            ],
            turrets: [
                { name: 'flamethrower', level: -1, equipped: false },
                { name: 'freeze', level: -1, equipped: false },
                { name: 'isida', level: -1, equipped: false },
                { name: 'machinegun', level: -1, equipped: false },
                { name: 'railgun', level: 3, equipped: true },
                { name: 'railgun_xt', level: -1, equipped: false },
                { name: 'ricochet', level: -1, equipped: false },
                { name: 'shaft', level: -1, equipped: false },
                { name: 'shotgun', level: -1, equipped: false },
                { name: 'smoky', level: -1, equipped: false },
                { name: 'thunder', level: -1, equipped: false },
                { name: 'twins', level: -1, equipped: false },
            ],
            hulls: [
                { name: 'dictator', level: -1, equipped: false },
                { name: 'hornet', level: 3, equipped: true },
                { name: 'hornet_xt', level: -1, equipped: false },
                { name: 'hunter', level: -1, equipped: false },
                { name: 'mammoth', level: -1, equipped: false },
                { name: 'titan', level: -1, equipped: false },
                { name: 'viking', level: -1, equipped: false },
                { name: 'wasp', level: -1, equipped: false },
            ],
            supplies: {
                health: 100,
                armor: 100,
                double_damage: 100,
                n2o: 100,
                mine: 100
            }
        }
    }

    public getUsername() {
        return this.username
    }

    public getProfileData() {
        return this.profileData;
    }

    public getGarageData() {
        return this.garageData;
    }

    public isAdmin() {
        return this.profileData.moderatorLevel === ChatModeratorLevel.COMMUNITY_MANAGER
    }

    public getModeratorLevel() {
        return this.profileData.moderatorLevel
    }

    public getCrystals() {
        return this.profileData.crystals
    }

    public getCrytalAbonementDuration() {
        return this.profileData.durationCrystalAbonement
    }

    public decreaseCrystals(amount: number) {
        this.profileData.crystals -= amount
    }

    public increaseCrystals(amount: number) {
        this.profileData.crystals += amount
    }

    public setCrystals(amount: number) {
        this.profileData.crystals = amount
    }

    public hasDoubleCrystal() {
        return this.profileData.hasDoubleCrystal
    }

    public getRank() {
        return this.profileData.rank
    }

    public getScore() {
        return this.profileData.score
    }

    public getPremiumData(): IPremiumData {
        const data = this.profileData.premium;

        const lifeTime = (data.endAt - data.startedAt) / 1000;
        const leftTime = (data.endAt - Date.now()) / 1000;

        return {
            enabled: leftTime > 0,
            showReminder: true,
            showWelcome: leftTime > 0 && !data.notified,
            reminderTime: Date.now(),
            leftTime: leftTime > 0 ? leftTime : -1,
            lifeTime: lifeTime
        }
    }
}