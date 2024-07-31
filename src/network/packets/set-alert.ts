import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAlertPacket extends Packet {

    public message: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ALERT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.message = bytes.readString();
        return {
            message: this.message
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.message);
        return bytes;
    }
}