import { Logger } from "../../utils/logger";

export interface IGarageTurret {
    name: string;
    level: number;
    equipped: boolean;
}

export interface IGarageHull {
    name: string;
    level: number;
    equipped: boolean;
}

export interface IGaragePainting {
    name: string;
    equipped: boolean
}

export interface IUserData {
    crystals: number;
    hasDoubleCrystal: boolean;
    durationCrystalAbonement: number
    garage: {
        turrets: IGarageTurret[];
        hulls: IGarageHull[];
        paintings: IGaragePainting[];
        supplies: {
            health: number;
            armor: number;
            double_damage: number;
            n2o: number;
            mine: number;
        };
    };
    rank: {
        score: number;
        rank: number;
    };
    rating: {
        place: number;
        rating: number;
    };
    premium: {
        notified: boolean;
        endAt?: number;
        startedAt?: number;
    };
}

export interface IPremiumData {
    enabled: boolean;
    showReminder: boolean;
    showWelcome: boolean;
    reminderTime: number;
    leftTime: number;
    lifeTime: number;
}

export class UserData {

    private static readonly clients = [
        new UserData('LearXD', 'suasenha123',
            {
                crystals: 100000000,
                hasDoubleCrystal: false,
                durationCrystalAbonement: 48602763,
                garage: {
                    paintings: [
                        { name: 'green', equipped: false },
                        { name: 'flora', equipped: true },
                    ],
                    turrets: [
                        { name: 'flamethrower', level: 0, equipped: true },
                        { name: 'freeze', level: -1, equipped: false },
                        { name: 'isis', level: -1, equipped: false },
                        { name: 'machinegun', level: -1, equipped: false },
                        { name: 'railgun', level: -1, equipped: false },
                        { name: 'ricochet', level: 0, equipped: false },
                        { name: 'shaft', level: -1, equipped: false },
                        { name: 'shotgun', level: -1, equipped: false },
                        { name: 'smoky', level: 0, equipped: false },
                        { name: 'thunder', level: 0, equipped: false },
                        { name: 'twins', level: -1, equipped: false },
                    ],
                    hulls: [
                        { name: 'dictator', level: -1, equipped: false },
                        { name: 'hornet', level: -1, equipped: false },
                        { name: 'hunter', level: 0, equipped: false },
                        { name: 'mammoth', level: -1, equipped: false },
                        { name: 'titan', level: -1, equipped: false },
                        { name: 'viking', level: 0, equipped: false },
                        { name: 'wasp', level: 0, equipped: true },
                    ],
                    supplies: {
                        armor: 100,
                        double_damage: 100,
                        health: 100,
                        mine: 100,
                        n2o: 100
                    }
                },
                rank: { score: 2000, rank: 30 },
                rating: { place: 1, rating: 1 },
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now()
                }
            }
        )
    ]

    constructor(
        private readonly username: string,
        private readonly password: string,
        private data: IUserData
    ) { }

    public static findByUsername(username: string) {
        return this.clients.find(client => client.username === username)
    }

    public getData() { return this.data }

    public getPremiumData(): IPremiumData {
        const data = this.data.premium;

        const premiumTime = (data.endAt - data.startedAt) / 1000;
        const leftTime = (data.endAt - Date.now()) / 1000;

        if (leftTime <= 0) {
            Logger.alert(`Premium expired for ${this.username}`);
        }

        return {
            enabled: leftTime > 0,
            showReminder: false,
            showWelcome: leftTime > 0 && !data.notified,
            reminderTime: Date.now(),
            leftTime: leftTime > 0 ? leftTime : -1,
            lifeTime: -1
        }
    }

    public getUsername() { return this.username }

    public getGarageItems() {
        return this.data.garage
    }

    public getTurrets() {
        return this.getGarageItems().turrets
    }

    public getHulls() {
        return this.getGarageItems().hulls
    }

    public getPaintings() {
        return this.getGarageItems().paintings
    }

    public getSupplies() {
        return this.getGarageItems().supplies
    }

    public getCrystals() { return this.data.crystals }
    public getRank() { return this.data.rank }
    public getScore() { return this.data.rank.score }
    public getRating() { return this.data.rating }

}