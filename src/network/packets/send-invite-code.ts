import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendInviteCodePacket extends Packet {

    public code: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_INVITE_CODE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.code = bytes.readString();
        return {
            code: this.code
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.code);
        return bytes;
    }
}