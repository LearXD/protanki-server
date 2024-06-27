import { SetCountryLocaleNamePacket } from "../../network/packets/set-country-locale-name";
import { ByteArray } from "../../utils/network/byte-array";

export class LocaleHandler {
    constructor() { }

    public sendLocaleConfig(locale: string = 'pt_BR') {
        const setCountryLocaleName = new SetCountryLocaleNamePacket(new ByteArray());
        setCountryLocaleName.countries = [
            { code: 'BR', countryName: 'Brasil' }
        ]
    }
}