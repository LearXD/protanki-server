import { ChatModeratorLevelType } from "../../../../utils/game/chat-moderator-level"

export interface IPlayerAuthData {
    username: string;
    password: string;
    email?: string;
    emailConfirmed?: boolean;
}

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

export interface IPlayerGarageData {
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
}