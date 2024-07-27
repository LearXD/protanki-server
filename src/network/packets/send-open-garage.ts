import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenGaragePacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_OPEN_GARAGE, bytes)
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