import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendVerifyEmailPacket extends Packet {

    public email: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_VERIFY_EMAIL, bytes)
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