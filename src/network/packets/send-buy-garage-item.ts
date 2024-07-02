import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBuyGarageItemPacket extends Packet {

    public item: string
    public count: number
    public price: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BUY_GARAGE_ITEM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.item = bytes.readString();
        this.count = bytes.readInt();
        this.price = bytes.readInt();
        return {
            item: this.item,
            count: this.count,
            price: this.price
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.item);
        bytes.writeInt(this.count);
        bytes.writeInt(this.price);
        return bytes;
    }
}