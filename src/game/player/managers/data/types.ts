import { ChatModeratorLevelType } from "../../../../utils/game/chat-moderator-level"

export interface IPlayerProfileData {
    crystals: number
    moderatorLevel: ChatModeratorLevelType
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