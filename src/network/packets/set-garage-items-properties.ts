import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

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

export interface IItem {
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
}

export class SetGarageItemsPropertiesPacket extends Packet {

    public items: IItem[]
    delayMountArmorInSec: number
    delayMountWeaponInSec: number
    delayMountColorInSec: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_GARAGE_ITEMS_PROPERTIES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            const parsed = JSON.parse(json);
            this.items = parsed.items;

            this.delayMountArmorInSec = parsed.delayMountArmorInSec;
            this.delayMountWeaponInSec = parsed.delayMountWeaponInSec;
            this.delayMountColorInSec = parsed.delayMountColorInSec;
        } catch (e) {
            console.error(e);
        }

        return {
            items: this.items
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(JSON.stringify({
            items: this.items,
            delayMountArmorInSec: this.delayMountArmorInSec,
            delayMountWeaponInSec: this.delayMountWeaponInSec,
            delayMountColorInSec: this.delayMountColorInSec
        }));

        return bytes;
    }
}