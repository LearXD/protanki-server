import { IGarageItem, IHullProperties, ITurretProperties, ITurretSfx } from "@/server/managers/garage/types";

export enum IItemType {
    TURRET = 'turret',
    HULL = 'hull',
    PAINTING = 'painting'
}

export interface IHullResources {
    hull: string,
    item: IGarageItem
    properties: IHullProperties
}

export interface ITurretResources {
    turret: string,
    item: IGarageItem
    properties: ITurretProperties
    sfx: ITurretSfx
}

export interface IPaintingResources {
    painting: string,
    item: IGarageItem
}