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
            {
                "code": "PT",
                "countryName": "Portugal"
            },
            {
                "code": "HN",
                "countryName": "Honduras"
            },
            {
                "code": "PY",
                "countryName": "Paraguai"
            },
            {
                "code": "HR",
                "countryName": "Croácia"
            },
            {
                "code": "HU",
                "countryName": "Hungria"
            },
            {
                "code": "QA",
                "countryName": "Catar"
            },
            {
                "code": "ID",
                "countryName": "Indonésia"
            },
            {
                "code": "IE",
                "countryName": "Indonésia"
            },
            {
                "code": "AF",
                "countryName": "Afeganistão"
            },
            {
                "code": "IN",
                "countryName": "Índia"
            },
            {
                "code": "IQ",
                "countryName": "Iraque"
            },
            {
                "code": "IR",
                "countryName": "Irã"
            },
            {
                "code": "IS",
                "countryName": "Islândia"
            },
            {
                "code": "AL",
                "countryName": "Albânia"
            },
            {
                "code": "IT",
                "countryName": "Itália"
            },
            {
                "code": "AM",
                "countryName": "Armênia"
            },
            {
                "code": "AR",
                "countryName": "Argentina"
            },
            {
                "code": "AT",
                "countryName": "Samoa Americana"
            },
            {
                "code": "AU",
                "countryName": "Austrália"
            },
            {
                "code": "AZ",
                "countryName": "Azerbaijão"
            },
            {
                "code": "RO",
                "countryName": "Romênia"
            },
            {
                "code": "BA",
                "countryName": "Bósnia e Herzegovina"
            },
            {
                "code": "RS",
                "countryName": "Sérvia"
            },
            {
                "code": "BD",
                "countryName": "Bangladesh"
            },
            {
                "code": "BE",
                "countryName": "Bélgica"
            },
            {
                "code": "RU",
                "countryName": "Rússia"
            },
            {
                "code": "BG",
                "countryName": "Bulgária"
            },
            {
                "code": "JO",
                "countryName": "Jordânia"
            },
            {
                "code": "RW",
                "countryName": "Ruanda"
            },
            {
                "code": "JP",
                "countryName": "Japão"
            },
            {
                "code": "BO",
                "countryName": "Bolívia"
            },
            {
                "code": "SA",
                "countryName": "EAU"
            },
            {
                "code": "BR",
                "countryName": "Brasil"
            },
            {
                "code": "SD",
                "countryName": "Sudão"
            },
            {
                "code": "SE",
                "countryName": "Suécia"
            },
            {
                "code": "SG",
                "countryName": "Singapura"
            },
            {
                "code": "SI",
                "countryName": "Eslovênia"
            },
            {
                "code": "BY",
                "countryName": "Bielorrússia"
            },
            {
                "code": "SK",
                "countryName": "Eslováquia"
            },
            {
                "code": "KE",
                "countryName": "Quênia"
            },
            {
                "code": "KG",
                "countryName": "Quirguistão"
            },
            {
                "code": "KH",
                "countryName": "Camboja"
            },
            {
                "code": "CA",
                "countryName": "Canadá"
            },
            {
                "code": "CD",
                "countryName": "Congo"
            },
            {
                "code": "CH",
                "countryName": "Suíça"
            },
            {
                "code": "SY",
                "countryName": "Síria"
            },
            {
                "code": "KR",
                "countryName": "Coreia"
            },
            {
                "code": "CL",
                "countryName": "Chile"
            },
            {
                "code": "CM",
                "countryName": "Camarões"
            },
            {
                "code": "CN",
                "countryName": "China"
            },
            {
                "code": "KV",
                "countryName": "Kosovo"
            },
            {
                "code": "CO",
                "countryName": "Colômbia"
            },
            {
                "code": "KW",
                "countryName": "Kuwait"
            },
            {
                "code": "CR",
                "countryName": "Costa Rica"
            },
            {
                "code": "KZ",
                "countryName": "Cazaquistão"
            },
            {
                "code": "CU",
                "countryName": "Cuba"
            },
            {
                "code": "TH",
                "countryName": "Tailândia"
            },
            {
                "code": "LA",
                "countryName": "Laos"
            },
            {
                "code": "CY",
                "countryName": "Chipre"
            },
            {
                "code": "LB",
                "countryName": "Líbano"
            },
            {
                "code": "TJ",
                "countryName": "Tajiquistão"
            },
            {
                "code": "CZ",
                "countryName": "República Tcheca"
            },
            {
                "code": "TM",
                "countryName": "Turcomenistão"
            },
            {
                "code": "TN",
                "countryName": "Tunísia"
            },
            {
                "code": "TR",
                "countryName": "Turquia"
            },
            {
                "code": "DE",
                "countryName": "Alemanha"
            },
            {
                "code": "TW",
                "countryName": "Taiwan"
            },
            {
                "code": "TZ",
                "countryName": "Tanzânia"
            },
            {
                "code": "DK",
                "countryName": "Dinamarca"
            },
            {
                "code": "LT",
                "countryName": "Lituânia"
            },
            {
                "code": "LU",
                "countryName": "Luxemburgo"
            },
            {
                "code": "LV",
                "countryName": "Letônia"
            },
            {
                "code": "UA",
                "countryName": "Ucrânia"
            },
            {
                "code": "UG",
                "countryName": "Uganda"
            },
            {
                "code": "MA",
                "countryName": "Marrocos"
            },
            {
                "code": "DZ",
                "countryName": "Argélia"
            },
            {
                "code": "MC",
                "countryName": "Mônaco"
            },
            {
                "code": "MD",
                "countryName": "Moldávia"
            },
            {
                "code": "ME",
                "countryName": "Montenegro"
            },
            {
                "code": "MG",
                "countryName": "Madagascar"
            },
            {
                "code": "EC",
                "countryName": "Equador"
            },
            {
                "code": "MK",
                "countryName": "Macedônia"
            },
            {
                "code": "US",
                "countryName": "USA"
            },
            {
                "code": "EE",
                "countryName": "Estônia"
            },
            {
                "code": "MN",
                "countryName": "Mongólia"
            },
            {
                "code": "EG",
                "countryName": "Egito"
            },
            {
                "code": "UY",
                "countryName": "Uruguai"
            },
            {
                "code": "UZ",
                "countryName": "Uzbequistão"
            },
            {
                "code": "MT",
                "countryName": "Malta"
            },
            {
                "code": "MV",
                "countryName": "Maldivas"
            },
            {
                "code": "VA",
                "countryName": "Vaticano"
            },
            {
                "code": "MX",
                "countryName": "México"
            },
            {
                "code": "MY",
                "countryName": "Malásia"
            },
            {
                "code": "MZ",
                "countryName": "Moçambique"
            },
            {
                "code": "ES",
                "countryName": "Espanha"
            },
            {
                "code": "ET",
                "countryName": "Etiópia"
            },
            {
                "code": "VE",
                "countryName": "Venezuela"
            },
            {
                "code": "NA",
                "countryName": "Namíbia"
            },
            {
                "code": "VN",
                "countryName": "Vietnã"
            },
            {
                "code": "NG",
                "countryName": "Nigéria"
            },
            {
                "code": "NI",
                "countryName": "Nicarágua"
            },
            {
                "code": "NL",
                "countryName": "Nicarágua"
            },
            {
                "code": "NO",
                "countryName": "Noruega"
            },
            {
                "code": "NP",
                "countryName": "Nepal"
            },
            {
                "code": "FI",
                "countryName": "Finlândia"
            },
            {
                "code": "FR",
                "countryName": "França"
            },
            {
                "code": "NZ",
                "countryName": "Nova Zelândia"
            },
            {
                "code": "GB",
                "countryName": "Reino Unido"
            },
            {
                "code": "GE",
                "countryName": "Geórgia"
            },
            {
                "code": "OM",
                "countryName": "Omã"
            },
            {
                "code": "GH",
                "countryName": "Gana"
            },
            {
                "code": "GR",
                "countryName": "Grécia"
            },
            {
                "code": "GT",
                "countryName": "Guatemala"
            },
            {
                "code": "PA",
                "countryName": "Panamá"
            },
            {
                "code": "PE",
                "countryName": "Peru"
            },
            {
                "code": "PH",
                "countryName": "Filipinas"
            },
            {
                "code": "PK",
                "countryName": "Paquistão"
            },
            {
                "code": "PL",
                "countryName": "Polônia"
            }
        ]
        client.sendPacket(setCountryLocaleName);
    }
}