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
import { PlayerDataManager } from "./managers/data";
import { SendLayoutStatePacket } from "../../network/packets/send-layout-state";

const IGNORE_PACKETS = [
    1484572481, // Pong
    -555602629
]

export class Player extends Tank {

    private updateInterval: NodeJS.Timeout;

    private viewingBattle: Battle;

    public layoutState: LayoutStateType;

    private bufferPool: ByteArray = new ByteArray();

    private dataManager: PlayerDataManager;

    private friendsManager: PlayerFriendsManager;
    private garageManager: PlayerGarageManager;
    private authManager: PlayerAuthManager;
    private chatManager: PlayerChatManager;
    private battlesManager: PlayerBattlesManager;
    private configsManager: PlayerConfigsManager;

    public constructor(socket: net.Socket, server: Server) {
        super(socket, server);

        this.dataManager = new PlayerDataManager(this);

        this.friendsManager = new PlayerFriendsManager(this);
        this.garageManager = new PlayerGarageManager(this);
        this.authManager = new PlayerAuthManager(this);
        this.chatManager = new PlayerChatManager(this);
        this.battlesManager = new PlayerBattlesManager(this);
        this.configsManager = new PlayerConfigsManager(this);

        this.init();
    }

    public getDataManager(): PlayerDataManager { return this.dataManager }

    public getFriendsManager(): PlayerFriendsManager { return this.friendsManager }
    public getGarageManager(): PlayerGarageManager { return this.garageManager }
    public getAuthManager(): PlayerAuthManager { return this.authManager }
    public getChatManager(): PlayerChatManager { return this.chatManager }
    public getBattlesManager(): PlayerBattlesManager { return this.battlesManager }
    public getConfigsManager(): PlayerConfigsManager { return this.configsManager }

    public async init() {
        Logger.debug(this.getIdentifier(), 'Initializing client');

        this.updateInterval = setInterval(this.update.bind(this), 1000);

        await this.getServer().getResourcesManager().sendResources(this, ResourceType.AUTH)

        this.getServer().getCaptchaManager().sendCaptchaLocations(this);

        await this.getServer().getTipsManager().sendLoadingTip(this);

        this.getServer().getAuthManager().sendAuthConfig(this);
    }

    public close() {
        this.getSocket().destroy();
        clearInterval(this.updateInterval);
    }

    public update() {
        super.update();
    }

    public getViewingBattle(): Battle { return this.viewingBattle }
    public setViewingBattle(battle: Battle) { this.viewingBattle = battle }

    public getLayoutState() { return this.layoutState }

    public setLayoutState(state: LayoutStateType) {

        switch (state) {
            case LayoutState.BATTLE:
                this.getServer().getChatManager().sendRemoveChatScreen(this);

                if (this.layoutState === LayoutState.BATTLE_SELECT) {
                    this.getServer().getBattlesManager().sendRemoveBattlesScreen(this);
                }

                if (this.layoutState === LayoutState.GARAGE) {
                    this.getServer().getGarageManager().removeGarageScreen(this);
                }
                break;
            case LayoutState.BATTLE_SELECT:
                if (this.layoutState === LayoutState.GARAGE) {
                    this.getServer().getGarageManager().removeGarageScreen(this);
                }
                break;
            case LayoutState.GARAGE:
                if (this.layoutState === LayoutState.BATTLE_SELECT) {
                    this.getServer().getBattlesManager().sendRemoveBattlesScreen(this);
                }
                break;
        }

        Logger.info(this.getIdentifier(), `Layout state changed to ${state}`);
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

        if (packet instanceof SendLayoutStatePacket) {
            Logger.debug(this.getIdentifier(), `Layout state changed to ${packet.state}`);
            if (packet.state === LayoutState.BATTLE_SELECT) {
                const battle = this.getBattle();
                console.log(battle)
                if (battle) {
                    battle.handleClientLeave(this);
                }
            }
            return
        }

        if (super.handlePacket(packet))
            return

        if (this.friendsManager.handlePacket(packet))
            return

        if (this.garageManager.handlePacket(packet))
            return

        if (this.authManager.handlePacket(packet))
            return

        if (this.chatManager.handlePacket(packet))
            return

        if (this.battlesManager.handlePacket(packet))
            return

        if (this.configsManager.handlePacket(packet))
            return
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