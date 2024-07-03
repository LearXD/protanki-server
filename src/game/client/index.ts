import net from "net";

import { SetCryptKeysPacket } from "../../network/packets/set-crypt-keys";
import { SimplePacket } from "../../network/packets/simple-packet";
import { MathUtils } from "../../utils/math";
import { ByteArray } from "../../utils/network/byte-array";
import { XorDecoder, XorType } from "../../utils/network/decoder";
import { Server } from "../../server";
import { Logger } from "../../utils/logger";
import { PingPacket } from "../../network/packets/ping";
import { ResolveCallbackPacket } from "../../network/packets/resolve-callback";
import { SetGameLoadedPacket } from "../../network/packets/set-game-loaded";
import { SendLanguagePacket } from "../../network/packets/send-languague";
import { SendRequestLoadScreenPacketPacket } from "../../network/packets/send-request-load-screen";
import { PongPacket } from "../../network/packets/pong";
import { SendRequestCaptchaPacket } from "../../network/packets/send-request-captcha";
import { SendLoginPacket } from "../../network/packets/send-login";
import { SendRequestUserDataPacket } from "../../network/packets/send-request-user-data";

const IGNORE_PACKETS = [
    1484572481, // Pong
    -555602629
]

export abstract class Client {

    private cryptoHandler: XorDecoder = new XorDecoder();

    private username: string;
    private language: string;

    private lastPing: number = 0;
    private lastPong: number = 0;

    private resourcesLoaded: number = 0;
    private resourcesCallbackPool: Map<number, () => void> = new Map();

    constructor(
        private readonly socket: net.Socket,
        private readonly server: Server
    ) {
        this.sendCryptKeys();
    }

    public getIdentifier() {
        return this.socket.remoteAddress + ':' + this.socket.remotePort;
    }

    public getCryptoHandler(): XorDecoder { return this.cryptoHandler }
    public sendCryptKeys() {
        const keys = Array.from({ length: 4 })
            .map(() => MathUtils.randomInt(-128, 127));

        this.cryptoHandler.setKeys(keys);
        this.cryptoHandler.init(keys, XorType.SERVER);

        const cryptPacket = new SetCryptKeysPacket(new ByteArray());
        cryptPacket.keys = this.getCryptoHandler().getKeys();
        this.sendPacket(cryptPacket, false);
    }

    public getServer(): Server { return this.server }
    public getSocket(): net.Socket { return this.socket }

    public getUsername() { return this.username }
    public setUsername(username: string) { this.username = username }

    public getLanguage() { return this.language }
    public setLanguage(language: string) { this.language = language }

    public updateLastPong() { this.lastPong = Date.now() }

    public getPing() { return this.lastPong - this.lastPing }
    public sendPing() {
        const packet = new PingPacket();
        this.sendPacket(packet);
    }

    public addResourceLoading(callback: () => void) {
        this.resourcesLoaded++;
        this.resourcesCallbackPool.set(this.resourcesLoaded, callback);
        return this.resourcesLoaded;
    }

    public update() {
        this.sendPing();
        this.lastPing = Date.now();
    }

    public sendGameLoaded() {
        const setGameLoadedPacket = new SetGameLoadedPacket(new ByteArray());
        this.sendPacket(setGameLoadedPacket);
    }

    public handlePacket(packet: SimplePacket) {

        if (packet instanceof PongPacket) {
            this.updateLastPong();
            return true;
        }


        if (packet instanceof SendLanguagePacket) {
            Logger.log(this.getIdentifier(), `Language set to '${packet.language}'`)
            this.language = packet.language;
            return true;
        }

        if (packet instanceof SendRequestLoadScreenPacketPacket) {
            this.getServer().getTipsManager()
                .sendLoadingTip(this);
            return true;
        }

        if (packet instanceof ResolveCallbackPacket) {
            if (this.resourcesCallbackPool.has(packet.callbackId)) {
                this.resourcesCallbackPool.get(packet.callbackId)();
                this.resourcesCallbackPool.delete(packet.callbackId);
            }
            return true;
        }

        if (packet instanceof SendRequestCaptchaPacket) {
            this.getServer().getCaptchaManager()
                .handleRequestCaptcha(this, packet.type);
            return true;
        }

        if (packet instanceof SendRequestUserDataPacket) {
            this.getServer().getUserDataManager()
                .handleRequestUserData(this, packet.userId);
        }


        return false;
    }

    public sendPacket(packet: SimplePacket, encrypt: boolean = true) {

        packet.setBytes(packet.encode());
        const buffer = packet.getBytes();

        if (buffer.length() && encrypt) {
            packet.setBytes(this.getCryptoHandler().encrypt(buffer));
        }

        if (!IGNORE_PACKETS.includes(packet.getPacketId())) {
            Logger.log(this.getIdentifier(), `Packet ${packet.constructor.name} (${packet.getPacketId()}) sent - ${packet.getBytes().length()} bytes`)
        }

        const data = packet.toByteArray().getBuffer()
        const rounds = Math.ceil(data.length / ByteArray.MAX_BUFFER_SIZE);

        for (let i = 0; i < rounds; i++) {
            this.getSocket()
                .write(data.subarray(i * ByteArray.MAX_BUFFER_SIZE, (i + 1) * ByteArray.MAX_BUFFER_SIZE));
        }
    }

} 