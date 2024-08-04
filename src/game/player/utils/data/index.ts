import { INT_MAX, INT_MIN } from "@/network/utils/primitive-types";
import { ChatModeratorLevel } from "../../../../states/chat-moderator-level";
import { Rank } from "../../../../states/rank";
import { Logger } from "../../../../utils/logger";
import { IPlayerAuthData, IPlayerGarageData, IPlayerProfileData, IPremiumData } from "./types";

export class PlayerData {

    private profileData: IPlayerProfileData;
    private garageData: IPlayerGarageData;

    public static profiles: { username: string, data: IPlayerProfileData }[] = [
        {
            username: 'PiuRap',
            data: {
                crystals: 2000,
                moderatorLevel: ChatModeratorLevel.MODERATOR,
                doubleCrystals: {
                    enabled: false,
                    endAt: 0
                },
                rank: Rank.COMMANDER,
                score: 2000,
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now() + (1000 * 60 * 10)
                }
            }
        },
        {
            username: 'TheUnknown',
            data: {
                crystals: 1e9,
                moderatorLevel: ChatModeratorLevel.COMMUNITY_MANAGER,
                doubleCrystals: {
                    enabled: true,
                    endAt: Date.now() + (1000 * 60 * 10) // 10 minutes
                },
                rank: Rank.GENERALISSIMO,
                score: 2000,
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now()
                }
            }
        },
        {
            username: 'LearXD',
            data: {
                crystals: 10000000,
                moderatorLevel: ChatModeratorLevel.ADMINISTRATOR,
                doubleCrystals: {
                    enabled: true,
                    endAt: Date.now() + (1000 * 60 * 10) // 10 minutes
                },
                rank: Rank.GENERALISSIMO,
                score: 2000,
                premium: {
                    notified: true,
                    startedAt: Date.now(),
                    endAt: Date.now() + 1000 * 60 * 10
                }
            }
        }
    ]

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
        // const exists = this.profiles.find(p => p.username === username);
        // if (!exists) {
        //     return null;
        // }
        return {
            username: username,
            password: 'suasenha123',
            email: 'contato@learxd.dev',
            emailConfirmed: true
        }
    }

    public static createPlayerData(username: string, password: string): IPlayerAuthData {
        const data = new PlayerData(username);
        data.profileData = {
            crystals: 500,
            moderatorLevel: ChatModeratorLevel.NONE,
            doubleCrystals: {
                enabled: false,
                endAt: 0
            },
            rank: Rank.GENERALISSIMO,
            score: 0,
            premium: {
                notified: false,
                startedAt: Date.now(),
                endAt: Date.now()
            }
        }
        this.profiles.push({ username: username, data: data.profileData });
        return {
            username: username,
            password: password,
            email: null,
            emailConfirmed: false
        };
    }

    public loadProfile() {
        const data = PlayerData.profiles.find(p => p.username === this.username);
        if (data) {
            this.profileData = data.data;
            return true;
        }

        this.profileData = {
            crystals: 0,
            moderatorLevel: ChatModeratorLevel.NONE,
            doubleCrystals: {
                enabled: false,
                endAt: 0
            },
            rank: Rank.GENERALISSIMO,
            score: 0,
            premium: {
                notified: false,
                startedAt: Date.now(),
                endAt: Date.now()
            }
        }
        return true;
        // return false;
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



    public decreaseCrystals(amount: number) {
        this.setCrystals(this.profileData.crystals - amount)
    }

    public increaseCrystals(amount: number) {
        this.setCrystals(this.profileData.crystals + amount)
    }

    public setCrystals(amount: number) {

        if (amount < INT_MIN || amount > INT_MAX) {
            Logger.error(`Invalid crystals value: ${amount}`)
            return;
        }

        this.profileData.crystals = amount
    }

    public hasDoubleCrystals() {
        return this.profileData.doubleCrystals.enabled
    }

    public getRank() {
        return this.profileData.rank
    }

    public getScore() {
        return this.profileData.score
    }

    public getDoubleCrystalsLeftTime() {
        if (!this.hasDoubleCrystals()) {
            return 0
        }
        const leftTime = this.profileData.doubleCrystals.endAt - Date.now()
        Logger.debug(`Double crystals left time: ${leftTime}`)
        return leftTime < 0 ? 0 : leftTime
    }

    public getPremiumData(): IPremiumData {
        const data = this.profileData.premium;

        const lifeTime = (data.endAt - data.startedAt) / 1000;
        const leftTime = (data.endAt - Date.now()) / 1000;

        return {
            enabled: leftTime > 0,
            showReminder: false,
            showWelcome: leftTime > 0 && !data.notified,
            reminderTime: -1,
            leftTime: leftTime > 0 ? leftTime : -1,
            lifeTime: lifeTime
        }
    }
}