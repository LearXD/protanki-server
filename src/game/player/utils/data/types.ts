import { ChatModeratorLevelType } from "../../../../states/chat-moderator-level"

export interface IPlayerAuthData {
    username: string;
    password: string;
    email?: string;
    emailConfirmed?: boolean;
}

export interface IPlayerProfileData {
    id: number
    email: string;
    nickname: string;
    role: ChatModeratorLevelType;
    password: string;
    crystals: number;
    experience: number;
    premium_end_at: number;
    pro_end_at: number;
    double_crystals_end_at: number;
    registered_at: number;
    last_login_at: number;
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