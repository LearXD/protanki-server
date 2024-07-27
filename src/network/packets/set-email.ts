import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetEmailPacket extends Packet {

    public email: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_EMAIL, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.email = bytes.readString();
        return {
            email: this.email
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.email);
        return bytes;
    }
}