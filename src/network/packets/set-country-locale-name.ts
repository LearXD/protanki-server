import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCountryLocaleNamePacket extends Packet {

    public countries: { code: string, countryName: string }[] = []

    constructor(bytes: ByteArray) {
        super(Protocol.SET_COUNTRY_LOCALE_NAME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.countries = new Array(length);

        for (let i = 0; i < length; i++) {
            this.countries[i] = {
                code: bytes.readString(),
                countryName: bytes.readString(),
            }
        }

        return {
            countries: this.countries
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.countries.length);
        this.countries.forEach(country => {
            bytes.writeString(country.code);
            bytes.writeString(country.countryName);
        });

        return bytes;
    }
}