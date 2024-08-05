import { ByteArray } from "../utils/byte-array";
import { ItemCategory } from "../../states/item-category";
import { ItemViewCategory } from "../../states/item-view-category";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface GarageItem {
    category: string
    itemViewCategory: string
    modificationIndex: number
    mounted: boolean
    name: string
    position: number
    premiumItem: boolean
    preview: number
    remaingTimeInMS: number
    item: string
}

export class SetGarageItemsPacket extends Packet {

    public items: GarageItem[] = []

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_GARAGE_ITEMS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();

        for (let i = 0; i < length; i++) {
            this.items[i] = {
                category: ItemCategory.CATEGORIES[bytes.readInt()],
                itemViewCategory: ItemViewCategory.CATEGORIES[bytes.readInt()],
                modificationIndex: bytes.readInt(),
                mounted: bytes.readBoolean(),
                name: bytes.readString(),
                position: bytes.readInt(),
                premiumItem: bytes.readBoolean(),
                preview: bytes.readInt(),
                remaingTimeInMS: bytes.readInt(),
                item: bytes.readString()
            }
        }


        return {
            items: this.items
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.items.length);

        this.items.forEach(item => {
            bytes.writeInt(ItemCategory.CATEGORIES.indexOf(item.category));
            bytes.writeInt(ItemViewCategory.CATEGORIES.indexOf(item.itemViewCategory));
            bytes.writeInt(item.modificationIndex);
            bytes.writeBoolean(item.mounted);
            bytes.writeString(item.name);
            bytes.writeInt(item.position);
            bytes.writeBoolean(item.premiumItem);
            bytes.writeInt(item.preview);
            bytes.writeInt(item.remaingTimeInMS);
            bytes.writeString(item.item);
        });

        return bytes;
    }
}