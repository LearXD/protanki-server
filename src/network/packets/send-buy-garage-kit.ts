import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBuyGarageKitPacket extends Packet {

    public item: string
    public price: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BUY_GARAGE_KIT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.item = bytes.readString();
        this.price = bytes.readInt();

        return {
            item: this.item,
            price: this.price
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.item);
        bytes.writeInt(this.price);
        return bytes;
    }
}