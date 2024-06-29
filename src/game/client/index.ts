import net from "net";

import Logger from "../../utils/logger";
import { Packet } from "../../network/packets/packet";
import { SimplePacket } from "../../network/packets/simple-packet";
import { Server } from "../../server";
import { Vector3d } from "../../utils/game/vector-3d";
import { MathUtils } from "../../utils/math";
import { ByteArray } from "../../utils/network/byte-array";
import { XorDecoder, XorType } from "../../utils/network/decoder";
import { ResolveCallbackPacket } from "../../network/packets/resolve-callback";
import { SEND_LANGUAGE } from "../../network/packets/send-languague";
import { PongPacket } from "../../network/packets/pong";
import { PingPacket } from "../../network/packets/ping";
import { SendRequestLoadScreenPacketPacket } from "../../network/packets/send-request-load-screen";
import { SendLoginPacket } from "../../network/packets/send-login";
import { SetCryptKeysPacket } from "../../network/packets/set-crypt-keys";
import { SetNetworkParamsPacket } from "../../network/packets/set-network-params";
import { SocialNetwork } from "../../utils/game/social-network";
import { SetCaptchaLocationsPacket } from "../../network/packets/set-captcha-locations";
import { CaptchaLocation } from "../../utils/game/captcha-location";
import { ResolveFullLoadedPacket } from "../../network/packets/resolve-full-loaded";
import { SetGameLoadedPacket } from "../../network/packets/set-game-loaded";
import { SetLayoutStatePacket } from "../../network/packets/set-layout-state";
import { LayoutState, LayoutStateType } from "../../utils/game/layout-state";
import { SetSubLayoutStatePacket } from "../../network/packets/set-sub-layout-state";
import { ResourceType } from "../../managers/resources";
import { SendChatMessagePacket } from "../../network/packets/send-chat-message";
import { SendCreateBattlePacket } from "../../network/packets/send-create-battle";
import { SetViewingBattlePacket } from "../../network/packets/set-viewing-battle";
import { Battle } from "../battle";
import { SendOpenGaragePacket } from "../../network/packets/send-open-garage";
import { SendOpenBattlesListPacket } from "../../network/packets/send-open-battles-list";

const IGNORE_PACKETS = [
    1484572481 // Pong
]

export class Client {

    private updateInterval: NodeJS.Timeout;

    public username: string;

    public language: string;
    public position: Vector3d;

    private lastPing: number = 0;
    private lastPong: number = 0;

    private viewingBattle: Battle;

    public layoutState: LayoutStateType = LayoutState.BATTLE_SELECT;

    public resourcesLoaded: number = 1;
    public resourcesCallbackPool: Map<number, () => void> = new Map();

    private encoder: XorDecoder;
    private bufferPool: ByteArray = new ByteArray();

    public constructor(
        private readonly socket: net.Socket,
        private readonly server: Server
    ) {
        this.encoder = new XorDecoder();

        const keys = Array.from({ length: 4 })
            .map(() => MathUtils.randomInt(-128, 127));

        this.encoder.setKeys(keys);
        this.encoder.init(keys, XorType.SERVER);

        this.updateInterval = setInterval(this.update.bind(this), 1000);

        this.init();
    }

    public async init() {
        Logger.debug(this.getIdentifier(), 'Initializing client');

        const cryptPacket = new SetCryptKeysPacket(new ByteArray());
        cryptPacket.keys = this.getEncoder().getKeys();
        this.sendPacket(cryptPacket, false);

        const socialNetworksPacket = new SetNetworkParamsPacket(new ByteArray());
        socialNetworksPacket.socialParams = SocialNetwork.NETWORKS;
        this.sendPacket(socialNetworksPacket);

        const captchaLocationsPacket = new SetCaptchaLocationsPacket(new ByteArray());
        captchaLocationsPacket.locations = CaptchaLocation.LOCATIONS;
        this.sendPacket(captchaLocationsPacket);

        const tip = await this.getServer().getTipsManager()
            .sendTipToClient(this);

        await Promise.all([
            this.getServer().getResourcesManager()
                .sendResources(this, ResourceType.AUTH),
            this.getServer().getTipsManager()
                .sendShowTip(this, tip.idlow)
        ])

        this.getServer().getAuthHandler().sendAuthConfig(this);

        const resolveFullLoadedPacket = new ResolveFullLoadedPacket(new ByteArray());
        this.sendPacket(resolveFullLoadedPacket);
    }

    public update() {
        const packet = new PingPacket(new ByteArray());
        this.lastPing = Date.now();
        this.sendPacket(packet);
    }

    public close() {
        this.getSocket().destroy();
        clearInterval(this.updateInterval);
    }

    public getServer(): Server { return this.server }
    public getSocket(): net.Socket { return this.socket; }

    public getEncoder(): XorDecoder { return this.encoder }

    public getLanguage() { return this.language }
    public getLayoutState() { return this.layoutState }

    public getUsername() { return this.username }
    public getPosition(): Vector3d { return this.position }
    public getViewingBattle() { return this.viewingBattle }
    public getPing() { return this.lastPong - this.lastPing }


    public setUsername(username: string) {
        this.username = username;
    }

    public setPosition(position: Vector3d) {
        this.position = position;
    }

    public setViewingBattle(battle: Battle) {
        this.viewingBattle = battle;
    }

    public getIdentifier() {
        return this.socket.remoteAddress + ':' + this.socket.remotePort;
    }

    public setLayoutState(state: LayoutStateType) {

        if (this.getLayoutState() === state) return;

        switch (this.getLayoutState()) {
            case LayoutState.GARAGE:
                this.getServer()
                    .getGarageManager()
                    .removeGarageScreen(this);
                break;
            case LayoutState.BATTLE_SELECT:
                this.getServer()
                    .getBattlesManager()
                    .removeBattleScreen(this);
        }

        this.layoutState = state;

        const setLayoutStatePacket = new SetLayoutStatePacket(new ByteArray());
        setLayoutStatePacket.state = state;

        this.sendPacket(setLayoutStatePacket);
    }

    public setSubLayoutState(principal: LayoutStateType, secondary: LayoutStateType) {
        const setLayoutStatePacket = new SetSubLayoutStatePacket(new ByteArray());
        setLayoutStatePacket.principal = principal;
        setLayoutStatePacket.secondary = secondary;
        this.sendPacket(setLayoutStatePacket);
    }

    public sendGameLoaded() {
        const setGameLoadedPacket = new SetGameLoadedPacket(new ByteArray());
        this.sendPacket(setGameLoadedPacket);
    }

    private handlePacket(packet: SimplePacket) {
        packet.decode();

        if (packet instanceof PongPacket) {
            this.lastPong = Date.now();
        }

        if (packet instanceof ResolveCallbackPacket) {
            if (this.resourcesCallbackPool.has(packet.callbackId)) {
                this.resourcesCallbackPool.get(packet.callbackId)();
                this.resourcesCallbackPool.delete(packet.callbackId);
            }
        }

        if (packet instanceof SEND_LANGUAGE) {
            Logger.log(this.getIdentifier(), `Language set to '${packet.language}'`)
            this.language = packet.language;
        }

        if (packet instanceof SendRequestLoadScreenPacketPacket) {
            this.getServer()
                .getTipsManager()
                .sendTipToClient(this);
        }

        if (packet instanceof SendLoginPacket) {
            this.server.getAuthHandler()
                .handleLogin(this, packet.username, packet.password, packet.remember);
        }

        if (packet instanceof SendChatMessagePacket) {
            this.getServer()
                .getChatManager()
                .handleClientSendMessage(this, packet.text, packet.target);
        }

        if (packet instanceof SendCreateBattlePacket) {
            this.getServer()
                .getBattlesManager()
                .handleCreateBattle(this, packet)
        }

        if (packet instanceof SetViewingBattlePacket) {
            this.getServer()
                .getBattlesManager()
                .handleViewBattle(this, packet.battleId.trim())
        }

        if (packet instanceof SendOpenGaragePacket) {
            this.getServer()
                .getGarageManager()
                .handleOpenGarage(this);
        }

        if (packet instanceof SendOpenBattlesListPacket) {
            this.getServer()
                .getBattlesManager()
                .handleOpenBattlesList(this);

        }

    }

    public sendPacket(packet: SimplePacket, encrypt: boolean = true) {
        packet.setBytes(packet.encode());
        const buffer = packet.getBytes();

        if (buffer.length() && encrypt) {
            packet.setBytes(this.getEncoder().encrypt(buffer));
        }

        const data = packet.toByteArray().getBuffer()
        const rounds = Math.ceil(data.length / ByteArray.MAX_BUFFER_SIZE);

        for (let i = 0; i < rounds; i++) {
            this.getSocket()
                .write(data.subarray(i * ByteArray.MAX_BUFFER_SIZE, (i + 1) * ByteArray.MAX_BUFFER_SIZE));
        }
    }

    public handleData = (data: Buffer) => {
        this.bufferPool.write(data)

        if (this.bufferPool.length() < Packet.HEADER_SIZE) {
            return;
        }

        while (true) {

            if (this.bufferPool.length() === 0) {
                break;
            }

            const length = this.bufferPool.readInt();
            const pid = this.bufferPool.readInt();

            const realLength = length - Packet.HEADER_SIZE;

            if (this.bufferPool.length() < realLength) {
                // console.log(`[${this.getIdentifier()}] Packet ${pid} not complete yet [${this.receivedBufferPool.length()} / ${realLength}]`)

                this.bufferPool = new ByteArray()
                    .writeInt(length)
                    .writeInt(pid)
                    .write(this.bufferPool.buffer);

                break;
            }

            const bytes = new ByteArray(this.bufferPool.readBytes(realLength));
            const decoded = this.encoder.decrypt(bytes);

            try {
                const packetInstance = this.getServer().getNetwork().findPacket<typeof SimplePacket>(pid);

                if (!IGNORE_PACKETS.includes(pid)) {
                    Logger.log(this.getIdentifier(), `Packet ${packetInstance.name} (${pid}) receive - ${realLength} bytes`)
                }

                const packet = new packetInstance(decoded);
                this.handlePacket(packet);
            } catch (error) {
                Logger.alert(this.getIdentifier(), `Packet Unknown (${pid}) receive - ${realLength} bytes`)
                if (error instanceof Error) {
                    Logger.error(this.getIdentifier(), error.message)
                    console.error(error.stack)
                }
            }
        }
    }
}