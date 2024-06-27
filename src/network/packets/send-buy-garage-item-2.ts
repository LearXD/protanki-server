import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBuyGarageItem2Packet extends Packet {

    public item: string
    public quantity: number

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_EQUIP_ITEM_2, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.item = bytes.readString();
        this.quantity = bytes.readInt();

        return {
            item: this.item,
            quantity: this.quantity

        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.item);
        bytes.writeInt(this.quantity);
        return bytes;
    }
}