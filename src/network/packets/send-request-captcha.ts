import { CaptchaLocation, CaptchaLocationType } from "../../utils/game/captcha-location";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRequestCaptchaPacket extends Packet {

    public type: CaptchaLocationType;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_REQUEST_CAPTCHA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.type = CaptchaLocation.ALL[bytes.readInt()] as CaptchaLocationType;

        return {
            type: this.type
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(CaptchaLocation.ALL.indexOf(this.type));
        return bytes;
    }
}