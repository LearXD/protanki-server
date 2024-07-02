import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetServerWillUpdatePacket extends Packet {

    public seconds: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SERVER_WILL_UPDATE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.seconds = bytes.readInt();
        return {
            seconds: this.seconds
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.seconds);
        return bytes;
    }
}