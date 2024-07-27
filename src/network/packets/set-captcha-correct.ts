import { CaptchaLocation, CaptchaLocationType } from "../../states/captcha-location";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCaptchaCorrectPacket extends Packet {

    public location: CaptchaLocationType;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CAPTCHA_CORRECT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.location = CaptchaLocation.ALL[bytes.readInt()] as CaptchaLocationType;

        return {
            location: this.location
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(CaptchaLocation.ALL.indexOf(this.location));
        return bytes;
    }
}