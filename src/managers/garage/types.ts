export interface IKitItem {
    count: number
    id: string
}

export interface IKit {
    image: number
    discountInPercent: number
    kitItems: IKitItem[]
}

export interface IDiscount {
    percent: number
    timeLeftInSeconds: number
    timeToStartInSeconds: number
}

export interface IProperty {
    property: string
    value: string
    subproperties: IProperty[]
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
    category: string
    properts: IProperty
    discount: IDiscount
    grouped: boolean
    isForRent: boolean
    price: number
    remainingTimeInSec: number
    modificationID?: number
    object3ds?: number
    coloring?: number
    kit?: IKit
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

//{"maxSpeed":7,"maxTurnSpeed":1.5533430342749532,"acceleration":10.9,"reverseAcceleration":13.53,"sideAcceleration":10.53,"turnAcceleration":1.910786523672936,"reverseTurnAcceleration":3.8030723335692005,"mass":2410,"power":10.9,"dampingCoeff":2500}
//{"maxSpeed":10,"maxTurnSpeed":1.584759014074073,"acceleration":10.41,"reverseAcceleration":17.77,"sideAcceleration":9.22,"turnAcceleration":2.864608986519448,"reverseTurnAcceleration":4.216192001874434,"mass":1616,"power":10.41,"dampingCoeff":1250}
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