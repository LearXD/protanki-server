import { Logger } from "../../utils/logger";

export interface IUserData {
    crystals: number;
    garage: {
        hasDoubleCrystal: boolean;
        durationCrystalAbonement: number;
        items: any[];
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
        new UserData(
            'LearXD',
            'suasenha123',
            {
                crystals: 1000000,
                garage: {
                    hasDoubleCrystal: false,
                    durationCrystalAbonement: 48602763,
                    items: []
                },
                rank: {
                    score: 2000,
                    rank: 28
                },
                rating: {
                    place: 1,
                    rating: 1
                },
                premium: {
                    notified: false,
                    startedAt: Date.now(),
                    endAt: Date.now()// + (1000 * 30)
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
    public getGarage() { return this.data.garage }
    public getCrystals() { return this.data.crystals }
    public getRank() { return this.data.rank }
    public getScore() { return this.data.rank.score }
    public getRating() { return this.data.rating }

}