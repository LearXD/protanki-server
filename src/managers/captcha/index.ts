import path from "path";

import { Player } from "../../game/player";
import { SetCaptchaDataPacket } from "../../network/packets/set-captcha-data";
import { Server } from "../../server";
import { CaptchaLocation, CaptchaLocationType } from "../../utils/game/captcha-location";
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
        const captchaLocationsPacket = new SetCaptchaLocationsPacket();
        captchaLocationsPacket.locations = this.LOCATIONS;
        client.sendPacket(captchaLocationsPacket);
    }

    public generateCaptcha() {
        const data = this.server.getAssetsManager().getData<Buffer>
            (path.join('captcha', 'image.jpg'), ReadType.BUFFER);

        return {
            response: 'ABCDE',
            data: data
        }
    }


}