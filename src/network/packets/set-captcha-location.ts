import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCaptchaLocationPacket extends Packet {

    public type: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CAPTCHA_LOCATION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.type = bytes.readInt();

        return {
            type: this.type
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.type);
        return bytes;
    }
}