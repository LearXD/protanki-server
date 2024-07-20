import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetOpenCountrySelectPacket extends Packet {

    public defaultCountry: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_OPEN_COUNTRY_SELECT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.defaultCountry = bytes.readString();
        return {
            defaultCountry: this.defaultCountry
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.defaultCountry);
        return bytes;
    }
}