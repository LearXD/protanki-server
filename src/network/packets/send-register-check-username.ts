import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRegisterCheckUsernamePacket extends Packet {

    public username: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_REGISTER_CHECK_USERNAME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.username = bytes.readString();

        return {
            username: this.username
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.username);
        return bytes;
    }
}