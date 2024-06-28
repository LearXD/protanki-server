import { Client } from "../../game/client";
import { SetCountryLocaleNamePacket } from "../../network/packets/set-country-locale-name";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class LocaleManager {
    constructor(
        private readonly server: Server
    ) { }

    public sendLocaleConfig(client: Client, locale: string = 'pt_BR') {
        const setCountryLocaleName = new SetCountryLocaleNamePacket(new ByteArray());
        setCountryLocaleName.countries = [
            { code: 'BR', countryName: 'Brasil' }
        ]
        client.sendPacket(setCountryLocaleName);
    }
}