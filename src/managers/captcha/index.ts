import path from "path";

import { Client } from "../../game/client";
import { SetCaptchaDataPacket } from "../../network/packets/set-captcha-data";
import { Server } from "../../server";
import { CaptchaLocationType } from "../../utils/game/captcha-location";
import { ByteArray } from "../../utils/network/byte-array";
import { CaptchaUtils } from "../../utils/game/captcha";
import { ReadType } from "../assets";

export class CaptchaManager {
    constructor(
        private readonly server: Server
    ) { }

    public handleRequestCaptcha(client: Client, location: CaptchaLocationType) {
        const data = this.server
            .getAssetsManager()
            .getData(
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