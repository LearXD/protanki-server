import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendChangePasswordPacket extends Packet {

    public password: string
    public email: string

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_CHANGE_PASSWORD, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.password = bytes.readString();
        return {
            password: this.password
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.password);
        return bytes;
    }
}