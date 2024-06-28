import { ByteArray } from "../../utils/network/byte-array";
import { CaptchaLocation } from "../../utils/game/captcha-location";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface ICaptchaLocation {
    key: number;
    value: string;
}

export class SetCaptchaLocationsPacket extends Packet {

    public locations: string[];

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CAPTCHA_LOCATIONS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const size = bytes.readInt();
        this.locations = new Array(size);

        for (let i = 0; i < size; i++) {
            this.locations[i] = CaptchaLocation.ALL[bytes.readInt()];
        }

        return this.locations;
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.locations.length);
        this.locations.forEach((location: string) => {
            bytes.writeInt(CaptchaLocation.ALL.indexOf(location));
        });

        return bytes;
    }

}