import { Client } from "../..";
import { SendCaptchaResponsePacket } from "../../../../network/packets/send-captcha-response";
import { SendRequestCaptchaPacket } from "../../../../network/packets/send-request-captcha";
import { SetCaptchaCorrectPacket } from "../../../../network/packets/set-captcha-correct";
import { SetCaptchaDataPacket } from "../../../../network/packets/set-captcha-data";
import { SetCaptchaIncorrectPacket } from "../../../../network/packets/set-captcha-incorrect";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { CaptchaUtils } from "../../../../utils/captcha";
import { CaptchaLocationType } from "../../../../states/captcha-location";
import { Logger } from "../../../../utils/logger";

export class ClientCaptchaManager {

    private type: CaptchaLocationType;
    private response: string;

    public constructor(
        private readonly client: Client
    ) { }

    public sendIncorrectCaptchaData(type: CaptchaLocationType, data: Buffer) {
        const packet = new SetCaptchaIncorrectPacket();
        packet.location = type;
        packet.newCaptcha = CaptchaUtils.encode(data);
        this.client.sendPacket(packet);
    }

    public sendCaptchaData(type: CaptchaLocationType, data: Buffer) {
        const packet = new SetCaptchaDataPacket();
        packet.type = type;
        packet.data = CaptchaUtils.encode(data);
        this.client.sendPacket(packet);
    }

    public handleRequestCaptcha(type: CaptchaLocationType) {
        const data = this.client.server.captchaManager.generateCaptcha();

        if (!data) {
            Logger.error('Failed to generate captcha data');
            return;
        }

        this.response = data.response;
        this.type = type;

        this.sendCaptchaData(type, data.data);
    }

    public handleCaptchaResponse(type: CaptchaLocationType, response: string) {
        if (type === this.type && response === this.response) {
            const packet = new SetCaptchaCorrectPacket();
            packet.location = type;
            this.client.sendPacket(packet);
            return;
        }

        const data = this.client.server.captchaManager.generateCaptcha();

        if (!data) {
            Logger.error('Failed to generate captcha data');
            return;
        }

        this.response = data.response;

        this.sendIncorrectCaptchaData(type, data.data);
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendRequestCaptchaPacket) {
            this.handleRequestCaptcha(packet.type);
        }

        if (packet instanceof SendCaptchaResponsePacket) {
            this.handleCaptchaResponse(packet.type, packet.response);
        }
    }
}