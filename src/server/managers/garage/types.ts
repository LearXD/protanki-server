export interface IGarageKitItem {
    count: number
    id: string
}

export interface IGarageKit {
    image: number
    discountInPercent: number
    kitItems: IGarageKitItem[]
}

export interface IGarageItemDiscount {
    percent: number
    timeLeftInSeconds: number
    timeToStartInSeconds: number
}

export interface IGarageItemProperty {
    property: string
    value: string
    subproperties: IGarageItemProperty[]
}

export interface IGarageItem {
    id: string
    name: string
    description: string
    isInventory: boolean
    index: number
    next_price: number
    next_rank: number
    type: number
    baseItemId: number
    previewResourceId: number
    rank: number
    category: GarageItemCategory
    properts: IGarageItemProperty[]
    discount: IGarageItemDiscount
    grouped: boolean
    isForRent: boolean
    price: number
    remainingTimeInSec: number
    modificationID?: number
    object3ds?: number
    coloring?: number
    kit?: IGarageKit
    count?: number
}

export enum GarageItemFolder {
    HULL = "hulls",
    TURRET = "turrets",
    PAINT = "paintings",
    SPECIAL = "specials",
    SUPPLY = "supplies",
    KIT = "kits"
}

export enum GarageItemCategory {
    HULL = 'armor',
    TURRET = 'weapon',
    PAINT = 'paint',
    SPECIAL = 'special',
    SUPPLY = 'inventory',
    KIT = 'kit',
    UNKNOWN = 'unknown'
}

export interface ITurretProperties {
    turret_turn_speed: number
    kickback: number
    turretTurnAcceleration: number
    impact_force: number
}

export type ITurretSfx = { [key: string]: any }

export interface IHullProperties {
    maxSpeed: number
    maxTurnSpeed: number
    acceleration: number
    reverseAcceleration: number
    sideAcceleration: number
    turnAcceleration: number
    reverseTurnAcceleration: number
    mass: number
    power: number
    dampingCoeff: number
}