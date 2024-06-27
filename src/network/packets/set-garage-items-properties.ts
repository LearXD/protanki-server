import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

interface Property {
    property: string;
    value: string | null;
    subproperties: Property[] | null;
}

interface Discount {
    percent: number;
    timeLeftInSeconds: number;
    timeToStartInSeconds: number;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    isInventory: boolean;
    index: number;
    next_price: number;
    next_rank: number;
    type: number;
    baseItemId: number;
    previewResourceId: number;
    rank: number;
    category: string;
    properties: Property[];
    discount: Discount;
    grouped: boolean;
    isForRent: boolean;
    price: number;
    remainingTimeInSec: number;
    modificationID: number;
    object3d: number
}

export interface ItemsProperties {
    items: Item[];
    delayMountArmorInSec: number,
    delayMountWeaponInSec: number,
    delayMountColorInSec: number
}

export class SetGarageItemsPropertiesPacket extends Packet {

    public items: ItemsProperties;
    // public items: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_GARAGE_ITEMS_PROPERTIES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const items = bytes.readString();

        try {
            this.items = JSON.parse(items);
        } catch (e) {
            console.error(e);
        }

        return {
            items: this.items
        }
    }

    public encode() {
        const bytes = new ByteArray();

        try {
            bytes.writeString(JSON.stringify(this.items));
        } catch (e) {
            console.error(e);
        }

        return bytes;
    }
}