import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendUseSupplyPacket extends Packet {

    public itemId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_USE_SUPPLY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.itemId = bytes.readString();
        return {
            itemId: this.itemId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.itemId);
        return bytes;
    }
}