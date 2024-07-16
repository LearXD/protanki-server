import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

interface TextTranslations {
    [code: string]: string;
}

interface Category {
    category_id: string;
    header_text: TextTranslations;
    description: TextTranslations;
}

interface AdditionalData {
    crystalls_count?: number;
    price?: number;
    premium_duration?: number;
    bonus_crystalls?: number;
    currency?: string;
}

interface Item {
    item_id: string;
    category_id: string;
    additional_data: AdditionalData;
}

export interface IShopData {
    categories: Category[];
    items: Item[];
}

export class SetShopDataPacket extends Packet {

    public haveDoubleCrystals: boolean;
    public data: IShopData

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SHOP_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            const data = JSON.parse(json);
            this.haveDoubleCrystals = data.have_double_crystals;
            this.data = JSON.parse(data.data);
        } catch (e) {
            console.error("Error parsing JSON", e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();
        try {
            bytes.writeString(JSON.stringify({
                have_double_crystals: this.haveDoubleCrystals,
                data: JSON.stringify(this.data)
            }));
        } catch (e) {
            console.error("Error encoding JSON", e);
        }
        return bytes;
    }
}