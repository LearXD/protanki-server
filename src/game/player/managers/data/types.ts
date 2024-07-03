export enum IItemType {
    TURRET = 'turret',
    HULL = 'hull',
    PAINTING = 'painting'
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
    level: number
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