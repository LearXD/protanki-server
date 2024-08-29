import net from "net";

import { Logger } from "../../utils/logger";
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
import { ResourceType } from "../../server/managers/resources/types";
import { Packet } from "@/network/packets/packet";
import { SendRequestUserDataPacket } from "@/network/packets/send-request-user-data";

export class Player extends Client {

    public battle: Battle;
    public tank: Tank;

    public data: PlayerData;

    public viewingBattle: Battle;
    public layoutState: LayoutStateType;

    public readonly dataManager: PlayerDataManager = new PlayerDataManager(this);
    public readonly friends: PlayerFriendsManager = new PlayerFriendsManager(this);
    public readonly garage: PlayerGarageManager = new PlayerGarageManager(this);
    public readonly auth: PlayerAuthManager = new PlayerAuthManager(this);
    public readonly chat: PlayerChatManager = new PlayerChatManager(this);
    public readonly battles: PlayerBattlesManager = new PlayerBattlesManager(this);
    public readonly configs: PlayerConfigsManager = new PlayerConfigsManager(this);
    public readonly shop: PlayerShopManager = new PlayerShopManager(this);
    public readonly quests: PlayerDailyQuestsManager = new PlayerDailyQuestsManager(this);

    private updateInterval: NodeJS.Timeout;

    public constructor(socket: net.Socket, server: Server) {
        super(socket, server);
        this.updateInterval = setInterval(this.update.bind(this), 1000);
    }

    public getName() {
        if (this.data && this.data.username) {
            return this.data.username
        }
        return super.getName();
    }

    public async init() {
        super.init();
        await this.server.resources.sendResources(this, ResourceType.AUTH)
        await this.server.tips.sendLoadingTip(this);
        this.server.captcha.sendCaptchaLocations(this);
        this.server.auth.sendAuthConfig(this);
    }

    public close() {
        clearInterval(this.updateInterval);

        if (this.auth.authenticated) {

            if (this.viewingBattle) {
                this.viewingBattle.viewersManager.removeViewer(this);
            }

            if (this.battle) {
                this.battle.onPlayerLeave(this)
            }

            this.server.players.removePlayer(this)
        }

        super.close();
    }

    public sendMessage(message: string) {
        if (this.battle) {
            this.battle.chatManager.sendMessage(this, message);
            return;
        }

        this.chat.sendMessage(message);
    }

    public handleChangeLayoutState(state: LayoutStateType, oldState: LayoutStateType) {
        switch (state) {
            case LayoutState.BATTLE:
                this.chat.sendRemoveChatScreen();

                if (oldState === LayoutState.BATTLE_SELECT) {
                    this.battles.sendRemoveBattlesScreen();
                }

                if (oldState === LayoutState.GARAGE) {
                    this.garage.closeGarage();
                }
                break;
            case LayoutState.BATTLE_SELECT:
                if (oldState === LayoutState.GARAGE) {
                    this.garage.removeGarageScreen();
                }
                break;
            case LayoutState.GARAGE:
                if (oldState === LayoutState.BATTLE_SELECT) {
                    this.battles.sendRemoveBattlesScreen();
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

    public handleClientSetLayoutState(state: LayoutStateType) {

        switch (state) {
            case LayoutState.BATTLE_SELECT: {

                if (this.battle) {
                    this.battle.onPlayerLeave(this)
                }

                if (this.layoutState === LayoutState.BATTLE_SELECT) {
                    this.chat.sendChat();
                    this.layoutState = LayoutState.BATTLE_SELECT;
                    this.setSubLayoutState(LayoutState.BATTLE_SELECT);
                    return
                }

                this.battles.sendBattleSelectScreen()
                this.setLayoutState(LayoutState.BATTLE_SELECT);
                this.setSubLayoutState(LayoutState.BATTLE_SELECT);

                break;
            }
            case LayoutState.GARAGE: {
                if (this.battle) {
                    this.battle.onPlayerLeave(this)
                }

                this.battles.sendRemoveBattlesScreen();
                this.chat.sendChat();
                this.garage.sendOpenGarage();
                break;
            }
        }
    }

    public handlePacket(packet: Packet) {
        super.handlePacket(packet)

        this.auth.handlePacket(packet)

        if (this.auth.authenticated) {

            if (packet instanceof SendLayoutStatePacket) {
                this.handleClientSetLayoutState(packet.state as LayoutStateType)
            }

            if (this.battle && this.tank) {
                this.tank.handlePacket(packet)
            }

            if (packet instanceof SendRequestUserDataPacket) {
                this.server.userDataManager.handleRequestUserData(this, packet.userId);
            }

            this.friends.handlePacket(packet)
            this.garage.handlePacket(packet)
            this.chat.handlePacket(packet)
            this.battles.handlePacket(packet)
            this.configs.handlePacket(packet)
            this.shop.handlePacket(packet)
            this.quests.handlePacket(packet)
        }
    }

    public update() {
        super.update();

        if (this.tank) {
            this.tank.update()
        }
    }
}