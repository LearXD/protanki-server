import { ITurretProperties } from "@/network/packets/set-turrets-data";
import { IGarageItem, IHullPhysics, ITurretPhysics, ITurretSfx } from "@/server/managers/garage/types";

export enum IItemType {
    TURRET = 'turret',
    HULL = 'hull',
    PAINTING = 'painting'
}

export interface IHullResources {
    hull: string,
    item: IGarageItem
    physics: IHullPhysics
}

export interface ITurretResources {
    turret: string,
    item: IGarageItem
    physics: ITurretPhysics
    sfx: ITurretSfx
    properties: ITurretProperties
}

export interface IPaintingResources {
    painting: string,
    item: IGarageItem
}