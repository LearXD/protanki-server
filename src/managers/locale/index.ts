import { Player } from "../../game/player";
import { SetCountryLocaleNamePacket } from "../../network/packets/set-country-locale-name";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class LocaleManager {
    constructor(
        private readonly server: Server
    ) { }

    public sendLocaleConfig(client: Player, locale: string = 'pt_BR') {
        const setCountryLocaleName = new SetCountryLocaleNamePacket(new ByteArray());

        setCountryLocaleName.countries = [
            { code: 'BR', countryName: 'Brasil' }
        ]
        setCountryLocaleName.defaultCountry = 'BR';
        setCountryLocaleName.boolean_1 = true;

        client.sendPacket(setCountryLocaleName);
    }
}