import { ByteArray } from "../../utils/network/byte-array";
import { ItemCategory } from "../../utils/game/item-category";
import { ItemViewCategory } from "../../utils/game/item-view-category";
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
}

// TODO: Foi usado para desbloquear itens ao upar de rank
export class SetGarageItemsPacket extends Packet {

    public items: GarageItem[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_GARAGE_ITEMS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.items = new Array(length);

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
                remaingTimeInMS: bytes.readInt()
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
        });

        return bytes;
    }
}