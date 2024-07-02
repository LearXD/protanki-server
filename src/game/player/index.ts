import net from "net";

import { Logger } from "../../utils/logger";
import { Packet } from "../../network/packets/packet";
import { SimplePacket } from "../../network/packets/simple-packet";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";
import { SetLayoutStatePacket } from "../../network/packets/set-layout-state";
import { LayoutState, LayoutStateType } from "../../utils/game/layout-state";
import { SetSubLayoutStatePacket } from "../../network/packets/set-sub-layout-state";
import { ResourceType } from "../../managers/resources";
import { Battle } from "../battle";
import { Tank } from "../tank";
import { PlayerFriendsManager } from "./managers/friends";
import { PlayerGarageManager } from "./managers/garage";
import { PlayerAuthManager } from "./managers/auth";
import { PlayerChatManager } from "./managers/chat";
import { PlayerBattlesManager } from "./managers/battles";
import { PlayerConfigsManager } from "./managers/configs";

const IGNORE_PACKETS = [
    1484572481, // Pong
    -555602629
]

export class Player extends Tank {

    private updateInterval: NodeJS.Timeout;

    private viewingBattle: Battle;

    public layoutState: LayoutStateType;

    private bufferPool: ByteArray = new ByteArray();

    private friendsManager: PlayerFriendsManager;
    private garageManager: PlayerGarageManager;
    private authManager: PlayerAuthManager;
    private chatManager: PlayerChatManager;
    private battlesManager: PlayerBattlesManager;
    private configsManager: PlayerConfigsManager;

    public constructor(socket: net.Socket, server: Server) {
        super(socket, server);

        this.friendsManager = new PlayerFriendsManager(this);
        this.garageManager = new PlayerGarageManager(this);
        this.authManager = new PlayerAuthManager(this);
        this.chatManager = new PlayerChatManager(this);
        this.battlesManager = new PlayerBattlesManager(this);
        this.configsManager = new PlayerConfigsManager(this);

        this.init();
    }

    public async init() {
        Logger.debug(this.getIdentifier(), 'Initializing client');

        this.updateInterval = setInterval(this.update.bind(this), 1000);

        await this.getServer().getResourcesManager()
            .sendResources(this, ResourceType.AUTH)

        this.getServer().getCaptchaManager()
            .sendCaptchaLocations(this);

        await this.getServer().getTipsManager()
            .sendLoadingTip(this);

        this.getServer().getAuthManager()
            .sendAuthConfig(this);

    }

    public close() {
        this.getSocket().destroy();
        clearInterval(this.updateInterval);
    }

    public update() {
        super.update();
    }

    public getLayoutState() { return this.layoutState }

    public getViewingBattle(): Battle { return this.viewingBattle }
    public setViewingBattle(battle: Battle) { this.viewingBattle = battle }

    public setLayoutState(state: LayoutStateType) {

        if (this.getLayoutState() === state) return;

        switch (this.getLayoutState()) {
            case LayoutState.GARAGE:
                this.getServer().getGarageManager()
                    .removeGarageScreen(this);
                break;
            case LayoutState.BATTLE_SELECT:
                this.getServer().getBattlesManager()
                    .sendRemoveBattlesScreen(this);
        }

        if (this.getLayoutState()) {
            switch (state) {
                case LayoutState.BATTLE_SELECT:
                    this.getServer().getBattlesManager()
                        .sendBattles(this);
                    break;
                case LayoutState.BATTLE:
                    this.getServer().getChatManager()
                        .sendRemoveChatScreen(this);
                    break;
            }
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

    public handlePacket(packet: SimplePacket): boolean {
        if (super.handlePacket(packet)) return
        if (this.friendsManager.handlePacket(packet)) return
        if (this.garageManager.handlePacket(packet)) return
        if (this.authManager.handlePacket(packet)) return
        if (this.chatManager.handlePacket(packet)) return
        if (this.battlesManager.handlePacket(packet)) return
        if (this.configsManager.handlePacket(packet)) return
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
                this.bufferPool = new ByteArray()
                    .writeInt(length)
                    .writeInt(pid)
                    .write(this.bufferPool.buffer);
                break;
            }

            const bytes = new ByteArray(this.bufferPool.readBytes(realLength));
            const decoded = this.getCryptoHandler().decrypt(bytes);

            try {
                const packetInstance = this.getServer().getNetwork().findPacket<typeof SimplePacket>(pid);

                if (!IGNORE_PACKETS.includes(pid)) {
                    Logger.log(this.getIdentifier(), `Packet ${packetInstance.name} (${pid}) receive - ${realLength} bytes`)
                }

                const packet = new packetInstance(decoded);
                packet.decode();
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