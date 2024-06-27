import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSomeUidPacket extends Packet {

    public uid: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_SOME_UID, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.uid = bytes.readString();

        return {
            uid: this.uid
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.uid);
        return bytes;
    }
}