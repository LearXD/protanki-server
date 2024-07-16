import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBuyShopItemPacket extends Packet {

    public itemId: string;
    public method: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BUY_SHOP_ITEM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.itemId = bytes.readString();
        this.method = bytes.readString();
        return {
            itemId: this.itemId,
            method: this.method
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.itemId);
        bytes.writeString(this.method);
        return bytes;
    }
}