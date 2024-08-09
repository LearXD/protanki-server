import { INT_MAX, INT_MIN } from "@/network/utils/primitive-types";
import { ChatModeratorLevel, ChatModeratorLevelType } from "../../../../states/chat-moderator-level";
import { Logger } from "../../../../utils/logger";
import { IPlayerAuthData, IPlayerGarageData, IPlayerProfileData, IPremiumData } from "./types";
import { Player } from "../..";
import { SetCrystalsPacket } from "@/network/packets/set-crystals";
import { RankManager } from "@/server/managers/rank";
import { SetScorePacket } from "@/network/packets/set-score";
import { SetUserNewRankPacket } from "@/network/packets/set-user-new-rank";

export class PlayerData {

    public crystals: number = 0;
    public experience: number = 0;
    public moderatorLevel: ChatModeratorLevelType = ChatModeratorLevel.NONE;

    public doubleCrystals = { startedAt: 0, endAt: 0 }
    public premium = { notified: false, startedAt: 0, endAt: 0 }

    public garage: IPlayerGarageData;

    public static profiles: { username: string, data: IPlayerProfileData }[] = [
        {
            username: 'PiuRap',
            data: {
                crystals: 2000,
                moderatorLevel: ChatModeratorLevel.MODERATOR,
                doubleCrystals: {
                    startedAt: Date.now(),
                    endAt: 0
                },
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
                    startedAt: Date.now(),
                    endAt: Date.now() + (1000 * 60 * 10) // 10 minutes
                },
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
                    startedAt: Date.now(),
                    endAt: Date.now() + (1000 * 60 * 10) // 10 minutes
                },
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
        public readonly username: string,
        private readonly player?: Player
    ) { }

    public static findPlayerData(username: string, player?: Player) {
        const data = new PlayerData(username, player);
        const loaded = data.loadProfile();

        if (loaded) {
            return data;
        }

        return null;
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

        this.profiles.push({
            username: username,
            data: {
                crystals: 500,
                moderatorLevel: ChatModeratorLevel.NONE,
                doubleCrystals: {
                    startedAt: 0,
                    endAt: 0
                },
                score: 0,
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now()
                }
            }
        });

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
            this.crystals = data.data.crystals;
            this.moderatorLevel = data.data.moderatorLevel;
            this.doubleCrystals = data.data.doubleCrystals;
            this.experience = data.data.score;
            this.premium = data.data.premium;
            return true;
        }

        return true;
        // return false;
    }

    public loadGarage() {
        this.garage = {
            paintings: [
                { name: 'green', equipped: true },
                // { name: 'africa', equipped: false },
            ],
            turrets: [
                { name: 'flamethrower', level: -1, equipped: false },
                { name: 'freeze', level: -1, equipped: false },
                { name: 'isida', level: -1, equipped: false },
                { name: 'machinegun', level: -1, equipped: false },
                { name: 'railgun', level: -1, equipped: false },
                { name: 'railgun_xt', level: -1, equipped: false },
                { name: 'ricochet', level: -1, equipped: false },
                { name: 'shaft', level: -1, equipped: false },
                { name: 'shotgun', level: -1, equipped: false },
                { name: 'smoky', level: 0, equipped: true },
                { name: 'thunder', level: -1, equipped: false },
                { name: 'twins', level: -1, equipped: false },
            ],
            hulls: [
                { name: 'dictator', level: -1, equipped: false },
                { name: 'hornet', level: -1, equipped: false },
                { name: 'hornet_xt', level: -1, equipped: false },
                { name: 'hunter', level: 0, equipped: true },
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

        if (this.username === "TheUnknown") {
            this.garage.turrets.map(turret => {
                turret.level = 3
            })

            this.garage.hulls.map(hull => {
                hull.level = 3
            })
        }
    }

    public isAdmin() {
        const level = ChatModeratorLevel.LEVELS.indexOf(this.moderatorLevel)
        return level >= ChatModeratorLevel.LEVELS.indexOf(ChatModeratorLevel.MODERATOR)
    }

    public decreaseCrystals(amount: number, silent?: boolean) {
        this.setCrystals(this.crystals - amount, silent)
    }

    public increaseCrystals(amount: number, silent?: boolean) {
        this.setCrystals(this.crystals + amount, silent)
    }

    public setCrystals(amount: number, silent: boolean = true) {

        if (amount < INT_MIN || amount > INT_MAX) {
            Logger.error(`Invalid crystals value: ${amount}`)
            return;
        }

        this.crystals = amount

        if (this.player && !silent) {
            const packet = new SetCrystalsPacket();
            packet.crystals = this.crystals
            this.player.sendPacket(packet)
        }
    }

    public addExperience(amount: number, silent?: boolean) {
        this.setExperience(this.experience + amount, silent)
    }

    public setExperience(amount: number, silent: boolean = true) {

        if (amount < INT_MIN || amount > INT_MAX) {
            Logger.error(`Invalid experience value: ${amount}`)
            return;
        }

        const old = this.getRank()
        this.experience = amount

        if (this.player && !silent) {
            const packet = new SetScorePacket();
            packet.score = this.experience
            this.player.sendPacket(packet)

            const rank = this.getRank()
            if (old !== rank) {
                this.player.server.rankManager.handlePlayerRankChange(this.player)
            }
        }
    }

    public getDoubleCrystalsLeftTime() {
        const leftTime = this.doubleCrystals.endAt - Date.now()
        return leftTime <= 0 ? 0 : leftTime
    }

    public hasDoubleCrystals() {
        const time = this.getDoubleCrystalsLeftTime()
        return time > 0
    }

    public getRank() {
        return RankManager.getRankByExperience(this.experience)
    }

    public getPremiumData(): IPremiumData {
        const data = this.premium;

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