import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class KickPacket extends Packet {

    public reason: string

    constructor(bytes?: ByteArray) {
        super(Protocol.KICK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.reason = bytes.readString();

        return {
            reason: this.reason
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.reason);
        return bytes;
    }
}