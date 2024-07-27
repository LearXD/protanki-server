import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSmokyCriticalEffectPacket extends Packet {

    public target: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SMOKY_CRITICAL_EFFECT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.target = bytes.readString();

        return {
            target: this.target
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.target);
        return bytes;
    }
}