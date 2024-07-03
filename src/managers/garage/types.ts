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