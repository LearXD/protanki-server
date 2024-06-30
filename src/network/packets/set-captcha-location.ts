import { CaptchaLocation } from "../../utils/game/captcha-location";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCaptchaLocationPacket extends Packet {

    public type: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CAPTCHA_LOCATION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.type = CaptchaLocation.ALL[bytes.readInt()];

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