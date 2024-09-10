import { INT_MAX, INT_MIN } from "@/network/utils/primitive-types";
import { ChatModeratorLevel, ChatModeratorLevelType } from "../../../../states/chat-moderator-level";
import { Logger } from "../../../../utils/logger";
import { IPlayerAuthData, IPlayerGarageData, IPlayerProfileData, IPremiumData } from "./types";
import { Player } from "../..";
import { SetCrystalsPacket } from "@/network/packets/set-crystals";
import { RankManager } from "@/server/managers/rank";
import { SetScorePacket } from "@/network/packets/set-score";

export class PlayerData {

    public username: string;
    public crystals: number = 0;
    public experience: number = 0;
    public role: ChatModeratorLevelType = ChatModeratorLevel.NONE;

    public doubleCrystals = { startedAt: null, endAt: null}
    public premium = { startedAt: null, endAt: null }
    public pro = { startedAt: null, endAt: null }

    public garage: IPlayerGarageData;

    public static profiles: IPlayerProfileData[] = [
        {
            id: 1,
            username: 'TheUnknown',
            email: 'contato@learxd.dev',
            role: ChatModeratorLevel.ADMINISTRATOR,
            password: '123',
            crystals: 500,
            experience: 0,
            premium_end_at: null,
            pro_end_at: null,
            double_crystals_end_at: null,
            registered_at: Date.now(),
            last_login_at: Date.now()
        }
    ]

    public constructor(
        public readonly profile: IPlayerProfileData,
        private readonly player?: Player
    ) {

        this.username = profile.username

        this.role = ChatModeratorLevel.LEVELS[profile.role]

        this.crystals = profile.crystals;
        this.experience = profile.experience;

        this.doubleCrystals.startedAt = profile.double_crystals_end_at
        this.doubleCrystals.endAt = profile.double_crystals_end_at

        this.premium.startedAt = profile.premium_end_at
        this.premium.endAt = profile.premium_end_at

        this.pro.startedAt = profile.pro_end_at
        this.pro.endAt = profile.pro_end_at
    }

    public static findPlayerData(username: string, player?: Player) {

        const profile = this.profiles.find(p => p.username === username)

        if (profile) {
            const data = new PlayerData(profile, player);
            return data;
        }

        return null;
    }

    public static createPlayerData(username: string, password: string): IPlayerAuthData {

        return {
            username: username,
            password: password,
            email: null,
            emailConfirmed: false
        };
    }

    public loadGarage() {
        this.garage = {
            paintings: [
                { name: 'green', equipped: true },
                { name: 'zeus', equipped: false },
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

        // if (this.username === "TheUnknown") {
        //     this.garage.turrets.map(turret => {
        //         turret.equipped = turret.name === 'freeze'
        //         // turret.equipped = turret.name === 'flamethrower'
        //         turret.level = 0
        //     })

        //     this.garage.hulls.map(hull => {
        //         hull.equipped = hull.name === 'hornet'
        //         hull.level = 3
        //     })

        //     this.garage.paintings.map(painting => {
        //         painting.equipped = painting.name === 'zeus'
        //     })
        // }
    }

    public isAdmin() {
        const levels = [ChatModeratorLevel.ADMINISTRATOR, ChatModeratorLevel.COMMUNITY_MANAGER, ChatModeratorLevel.MODERATOR]
        return levels.includes(this.role)
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
                this.player.server.ranks.handlePlayerRankChange(this.player)
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

        const lifeTime = (this.premium.endAt - this.premium.startedAt) / 1000;
        const leftTime = (this.premium.endAt - Date.now()) / 1000;

        return {
            enabled: leftTime > 0,
            showReminder: false,
            showWelcome: false,
            reminderTime: -1,
            leftTime: leftTime > 0 ? leftTime : -1,
            lifeTime: lifeTime
        }
    }
}