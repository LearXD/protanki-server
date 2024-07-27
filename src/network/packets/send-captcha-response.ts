import { CaptchaLocation, CaptchaLocationType } from "../../states/captcha-location";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendCaptchaResponsePacket extends Packet {

    public type: CaptchaLocationType;
    public response: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_CAPTCHA_RESPONSE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.type = CaptchaLocation.ALL[bytes.readInt()] as CaptchaLocationType;
        this.response = bytes.readString();

        return {
            type: this.type,
            response: this.response
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(CaptchaLocation.ALL.indexOf(this.type));
        bytes.writeString(this.response);

        return bytes;
    }
}