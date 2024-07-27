import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendAutoDestroyPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_AUTO_DESTROY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}