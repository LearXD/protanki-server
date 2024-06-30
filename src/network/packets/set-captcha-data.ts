import { CaptchaLocation } from "../../utils/game/captcha-location";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCaptchaDataPacket extends Packet {

    public type: string;
    public data: number[]

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CAPTCHA_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.type = CaptchaLocation.ALL[bytes.readInt()];

        const size = bytes.readInt();
        this.data = new Array(size);

        for (let i = 0; i < size; i++) {
            this.data[i] = bytes.readByte();
        }

        return {
            type: this.type,
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(CaptchaLocation.ALL.indexOf(this.type));
        bytes.writeInt(this.data.length);

        // TODO: improve this
        for (const byte of this.data) {
            bytes.writeByte(byte)
        }


        return bytes;
    }
}