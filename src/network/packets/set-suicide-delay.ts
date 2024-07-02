import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSuicideDelayPacket extends Packet {

    public delay: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SUICIDE_DELAY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.delay = bytes.readInt();
        return {
            delay: this.delay
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.delay)
        return bytes;
    }
}