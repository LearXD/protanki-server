import path from "path";

import { Player } from "../../game/player";
import { SetCaptchaDataPacket } from "../../network/packets/set-captcha-data";
import { Server } from "../../server";
import { CaptchaLocation, CaptchaLocationType } from "../../utils/game/captcha-location";
import { ByteArray } from "../../utils/network/byte-array";
import { CaptchaUtils } from "../../utils/game/captcha";
import { SetCaptchaLocationsPacket } from "../../network/packets/set-captcha-locations";
import { Client } from "../../game/client";
import { ReadType } from "../assets/types";

export class CaptchaManager {

    private readonly LOCATIONS = [
        CaptchaLocation.ACCOUNT_SETTINGS_FORM,
        CaptchaLocation.REGISTER_FORM,
        CaptchaLocation.RESTORE_PASSWORD_FORM,
        CaptchaLocation.EMAIL_CHANGE_HASH
    ]

    constructor(
        private readonly server: Server
    ) { }

    public sendCaptchaLocations(client: Player) {
        const captchaLocationsPacket = new SetCaptchaLocationsPacket(new ByteArray());
        captchaLocationsPacket.locations = this.LOCATIONS;
        client.sendPacket(captchaLocationsPacket);
    }

    public handleRequestCaptcha(client: Client, location: CaptchaLocationType) {
        const data = this.server.getAssetsManager().getData(
            path.join('captcha', 'image.jpg'), ReadType.BUFFER
        );

        this.sendCaptchaData(client, { type: location, data });
    }

    public sendCaptchaData = (client: Client, data: { type: CaptchaLocationType, data: Buffer }) => {
        const setCaptchaDataPacket = new SetCaptchaDataPacket(new ByteArray());
        setCaptchaDataPacket.type = data.type;
        setCaptchaDataPacket.data = CaptchaUtils.encode(data.data);

        client.sendPacket(setCaptchaDataPacket);
    }
}