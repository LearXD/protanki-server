import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetLoginHashPacket extends Packet {

    public hash: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LOGIN_HASH, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.hash = bytes.readString();

        return {
            hash: this.hash
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.hash);
        return bytes;
    }
}