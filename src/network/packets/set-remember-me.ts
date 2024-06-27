import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRememberMePacket extends Packet {

    public rememberMe: boolean

    constructor(bytes: ByteArray) {
        super(Protocol.SET_REMEMBER_ME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.rememberMe = bytes.readBoolean();

        return {
            rememberMe: this.rememberMe
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeBoolean(this.rememberMe);
        return bytes;
    }
}