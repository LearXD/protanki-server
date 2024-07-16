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