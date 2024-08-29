import { Player } from "@/game/player";
import { SetCaptchaLocationsPacket } from "@/network/packets/set-captcha-locations";
import { Server } from "@/server";
import { CaptchaLocation } from "@/states/captcha-location";
import path from "path";
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
        const data = this.server.assets.getData<Buffer>
            (path.join('captcha', 'image.jpg'), ReadType.BUFFER);

        return {
            response: 'ABCDE',
            data: data
        }
    }


}