import net from "net";

import { Logger } from "../../utils/logger";
import { SimplePacket } from "../../network/packets/simple-packet";
import { Server } from "../../server";
import { SetLayoutStatePacket } from "../../network/packets/set-layout-state";
import { LayoutState, LayoutStateType } from "../../states/layout-state";
import { SetSubLayoutStatePacket } from "../../network/packets/set-sub-layout-state";

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
import { PlayerShopManager } from "./managers/shop";
import { PlayerDailyQuestsManager } from "./managers/daily-quests";
import { Client } from "../client";
import { PlayerData } from "./utils/data";
import { PlayerPacketHandler } from "./handlers/packet";
import { ResourceType } from "../../server/managers/resources/types";

export class Player extends Client {

    private updateInterval: NodeJS.Timeout;

    private viewingBattle: Battle;
    public layoutState: LayoutStateType;

    public battle: Battle;
    public tank: Tank;

    public data: PlayerData;

    private packetHandler: PlayerPacketHandler;

    public readonly dataManager: PlayerDataManager = new PlayerDataManager(this);
    public readonly friendsManager: PlayerFriendsManager = new PlayerFriendsManager(this);
    public readonly garageManager: PlayerGarageManager = new PlayerGarageManager(this);
    public readonly authManager: PlayerAuthManager = new PlayerAuthManager(this);
    public readonly chatManager: PlayerChatManager = new PlayerChatManager(this);
    public readonly battlesManager: PlayerBattlesManager = new PlayerBattlesManager(this);
    public readonly configsManager: PlayerConfigsManager = new PlayerConfigsManager(this);
    public readonly shopManager: PlayerShopManager = new PlayerShopManager(this);
    public readonly dailyQuestsManager: PlayerDailyQuestsManager = new PlayerDailyQuestsManager(this);

    public constructor(socket: net.Socket, server: Server) {
        super(socket, server);

        this.packetHandler = new PlayerPacketHandler(this);

        this.dataManager = new PlayerDataManager(this);

        this.friendsManager = new PlayerFriendsManager(this);
        this.garageManager = new PlayerGarageManager(this);
        this.authManager = new PlayerAuthManager(this);
        this.chatManager = new PlayerChatManager(this);
        this.battlesManager = new PlayerBattlesManager(this);
        this.configsManager = new PlayerConfigsManager(this);
        this.shopManager = new PlayerShopManager(this);
        this.dailyQuestsManager = new PlayerDailyQuestsManager(this);

        this.updateInterval = setInterval(this.update.bind(this), 1000);

        this.init();
    }

    public async init() {
        Logger.debug('Initializing client');
        await this.server.resourcesManager.sendResources(this, ResourceType.AUTH)
        await this.server.tipsManager.sendLoadingTip(this);
        this.server.captchaManager.sendCaptchaLocations(this);
        this.server.authManager.sendAuthConfig(this);
    }

    public close() {
        clearInterval(this.updateInterval);
        this.socket.destroy();

        if (this.viewingBattle) {
            this.viewingBattle.viewersManager.removeViewer(this);
        }

        if (this.battle) {
            this.battle.handleClientLeave(this)
        }

        if (this.authManager.isAuthenticated()) {
            this.server.playersManager.removePlayer(this)
        }

        this.server.getClientHandler().handleDisconnection(this);
    }

    public getUsername() {
        return this.data.username
    }

    public getViewingBattle(): Battle {
        return this.viewingBattle
    }

    public setViewingBattle(battle: Battle) {
        this.viewingBattle = battle
    }

    public getLayoutState() {
        return this.layoutState
    }

    public handleChangeLayoutState(state: LayoutStateType, oldState: LayoutStateType) {
        switch (state) {
            case LayoutState.BATTLE:
                this.chatManager.sendRemoveChatScreen();

                if (oldState === LayoutState.BATTLE_SELECT) {
                    this.battlesManager.sendRemoveBattlesScreen();
                }

                if (oldState === LayoutState.GARAGE) {
                    this.garageManager.closeGarage();
                }
                break;
            case LayoutState.BATTLE_SELECT:
                if (oldState === LayoutState.GARAGE) {
                    this.garageManager.removeGarageScreen();
                }
                break;
            case LayoutState.GARAGE:
                if (oldState === LayoutState.BATTLE_SELECT) {
                    this.battlesManager.sendRemoveBattlesScreen();
                }
                break;
        }
    }

    public setLayoutState(state: LayoutStateType) {

        if (this.layoutState === state) {
            return;
        }

        Logger.info(`Layout state changed to ${state}`);
        const oldState = this.layoutState;
        this.layoutState = state;

        const setLayoutStatePacket = new SetLayoutStatePacket();
        setLayoutStatePacket.state = state;
        this.sendPacket(setLayoutStatePacket);

        if (oldState) {
            this.handleChangeLayoutState(state, oldState);
        }
    }

    public setSubLayoutState(secondary: LayoutStateType) {
        const setLayoutStatePacket = new SetSubLayoutStatePacket();
        setLayoutStatePacket.principal = this.battle ? LayoutState.BATTLE : this.layoutState;
        setLayoutStatePacket.secondary = secondary;
        this.sendPacket(setLayoutStatePacket);
    }

    public sendMessage(message: string) {
        if (this.battle) {
            this.battle.chatManager.sendMessage(this, message);
            return;
        }

        this.chatManager.sendMessage(message);
    }

    public handleClientSetLayoutState(state: LayoutStateType) {

        switch (state) {
            case LayoutState.BATTLE_SELECT: {
                if (this.battle) {
                    this.battle.handleClientLeave(this)
                }

                if (this.layoutState === LayoutState.BATTLE_SELECT) {
                    this.chatManager.sendChat();
                    this.layoutState = LayoutState.BATTLE_SELECT;
                    this.setSubLayoutState(LayoutState.BATTLE_SELECT);
                    return
                }

                this.battlesManager.sendBattleSelectScreen()
                this.setLayoutState(LayoutState.BATTLE_SELECT);
                this.setSubLayoutState(LayoutState.BATTLE_SELECT);

                break;
            }
            case LayoutState.GARAGE: {
                if (this.battle) {
                    this.battle.handleClientLeave(this)
                }

                this.battlesManager.sendRemoveBattlesScreen();
                this.chatManager.sendChat();
                this.garageManager.sendOpenGarage();
                break;
            }
        }
    }

    public handlePacket(packet: SimplePacket): boolean {

        super.handlePacket(packet)
        this.authManager.handlePacket(packet)

        if (!this.authManager.isAuthenticated()) {
            return;
        }

        this.friendsManager.handlePacket(packet)
        this.garageManager.handlePacket(packet)
        this.chatManager.handlePacket(packet)
        this.battlesManager.handlePacket(packet)
        this.configsManager.handlePacket(packet)
        this.shopManager.handlePacket(packet)
        this.dailyQuestsManager.handlePacket(packet)

        if (this.tank) {
            this.tank.handlePacket(packet)
        }

        if (packet instanceof SendLayoutStatePacket) {
            this.handleClientSetLayoutState(packet.state as LayoutStateType)
        }

    }

    public update() {
        super.update();
    }

    public getPacketHandler(): PlayerPacketHandler {
        return this.packetHandler
    }

}