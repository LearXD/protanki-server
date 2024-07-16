import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBuyShopItemPacket extends Packet {

    public itemId: string;
    public string_1: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BUY_SHOP_ITEM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.itemId = bytes.readString();
        this.string_1 = bytes.readString();
        return {
            itemId: this.itemId,
            string_1: this.string_1
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.itemId);
        bytes.writeString(this.string_1);
        return bytes;
    }
}