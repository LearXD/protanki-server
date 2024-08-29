import { SetCryptKeysPacket } from "../../network/packets/set-crypt-keys";
import { Logger } from "../../utils/logger";
import { PingPacket } from "../../network/packets/ping";
import { SendLanguagePacket } from "../../network/packets/send-language";
import { SendRequestLoadScreenPacket } from "../../network/packets/send-request-load-screen";
import { PongPacket } from "../../network/packets/pong";
import { ClientCaptchaManager } from "./managers/captcha";
import { SetAlertPacket } from "@/network/packets/set-alert";
import { Packet } from "@/network/packets/packet";
import { ClientResourcesManager } from "./managers/resources";
import { PacketHandler } from "./utils/packet-handler";

export abstract class Client extends PacketHandler {

    public language: string;

    private lastPingSent: number = Date.now();
    private lastPongReceived: number = Date.now();

    public ping: number = 0;

    public readonly captcha: ClientCaptchaManager = new ClientCaptchaManager(this);
    public readonly resources: ClientResourcesManager = new ClientResourcesManager(this);

    public init() {
        Logger.info(`Initializing client ${this.getName()}`)
        const cryptPacket = new SetCryptKeysPacket();
        cryptPacket.keys = this.crypto.keys;
        this.sendPacket(cryptPacket, false);
    }

    public close() {
        this.server.getClientHandler().handleDisconnection(this);
        super.close();
    }

    public sendPing() {
        this.lastPingSent = Date.now();
        const packet = new PingPacket();
        this.sendPacket(packet);
    }

    public showAlert(message: string) {
        const packet = new SetAlertPacket()
        packet.message = message;
        this.sendPacket(packet);
    }

    public handlePacket(packet: Packet) {

        this.captcha.handlePacket(packet);
        this.resources.handlePacket(packet);

        if (packet instanceof PongPacket) {
            if (this.lastPingSent !== null) {
                this.lastPongReceived = Date.now();
                this.ping = Date.now() - this.lastPingSent;
            }
        }

        if (packet instanceof SendLanguagePacket) {
            this.language = packet.language;
        }

        if (packet instanceof SendRequestLoadScreenPacket) {
            this.server.tips.sendLoadingTip(this);
        }
    }

    public update() {
        this.sendPing();

        if ((this.lastPingSent - this.lastPongReceived) > 5000) {
            Logger.warn(`Ping timeout for ${this.getName()}`)
            this.close();
        }
    }

} 