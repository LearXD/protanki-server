import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRequestLoadScreenPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_REQUEST_LOAD_SCREEN, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}