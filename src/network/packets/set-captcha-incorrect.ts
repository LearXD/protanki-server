import { CaptchaLocation, CaptchaLocationType } from "../../utils/game/captcha-location";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCaptchaIncorrectPacket extends Packet {

    public location: CaptchaLocationType;
    public newCaptcha: number[];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CAPTCHA_INCORRECT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.location = CaptchaLocation.ALL[bytes.readInt()] as CaptchaLocationType;

        const size = bytes.readInt();
        this.newCaptcha = new Array(size);

        for (let i = 0; i < size; i++) {
            this.newCaptcha[i] = bytes.readByte();
        }

        return {
            location: this.location,
            newCaptcha: this.newCaptcha
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(CaptchaLocation.ALL.indexOf(this.location));
        bytes.writeInt(this.newCaptcha.length);

        // TODO: improve this
        for (const byte of this.newCaptcha) {
            bytes.writeByte(byte)
        }

        return bytes;
    }
}