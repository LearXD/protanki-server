import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCountryLocaleNamePacket extends Packet {

    public countries: { code: string, countryName: string }[] = []
    public defaultCountry: string;
    public boolean_1: boolean;

    constructor(bytes?: ByteArray) {
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

        this.defaultCountry = bytes.readString();
        this.boolean_1 = bytes.readBoolean();

        return {
            countries: this.countries,
            defaultCountry: this.defaultCountry,
            boolean_1: this.boolean_1
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.countries.length);
        this.countries.forEach(country => {
            bytes.writeString(country.code);
            bytes.writeString(country.countryName);
        });

        bytes.writeString(this.defaultCountry);
        bytes.writeBoolean(this.boolean_1);

        return bytes;
    }
}