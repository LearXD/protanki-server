import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetChangePasswordScreenPacket extends Packet {

    public currentEmail: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CHANGE_PASSWORD_SCREEN, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.currentEmail = bytes.readString();
        return {
            currentEmail: this.currentEmail
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.currentEmail);
        return bytes;
    }
}