import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetGiftReceivedPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_GIFT_RECEIVED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {

        }
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}