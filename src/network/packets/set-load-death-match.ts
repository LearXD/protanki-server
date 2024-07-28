import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetLoadDeathMatchPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LOAD_DEATH_MATCH, bytes)
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