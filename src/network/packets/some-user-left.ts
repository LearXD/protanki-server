import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SomeUserLeftPacket extends Packet {

    public userId: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SOME_USER_LEFT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();

        return {
            userId: this.userId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.userId);
        return bytes;
    }
}