import { Logger } from "../../utils/logger";
import { ByteArray } from "../utils/byte-array";
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
    properts: IProperty[]
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

export class SetUserGarageItemsPacket extends Packet {

    public items: IItem[]
    public garageBoxId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_GARAGE_ITEMS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const json = bytes.readString();

        try {
            const parsed = JSON.parse(json);
            this.items = parsed.items
            this.garageBoxId = parsed.garageBoxId
        } catch (e) {
            Logger.error('SetUserGarageItemsPacket', e);
        }

        return {
            items: this.items
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(JSON.stringify({
            items: this.items,
            garageBoxId: this.garageBoxId
        }));

        return bytes;
    }
}