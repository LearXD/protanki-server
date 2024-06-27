import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCaptchaResponsePacket extends Packet {

    public type: number;
    public response: string

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CAPTCHA_RESPONSE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.type = bytes.readInt();
        this.response = bytes.readString();

        return {
            type: this.type,
            response: this.response
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.type);
        bytes.writeString(this.response);

        return bytes;
    }
}