export interface IPlayerProfileData {
    crystals: number
    hasDoubleCrystal: boolean
    durationCrystalAbonement: number
    rank: number
    score: number
    premium: {
        notified: boolean
        endAt?: number
        startedAt?: number
    }
}

export interface IPremiumData {
    enabled: boolean;
    showReminder: boolean;
    showWelcome: boolean;
    reminderTime: number;
    leftTime: number;
    lifeTime: number;
}

export interface IAuthData {
    username: string;
    password: string;
}