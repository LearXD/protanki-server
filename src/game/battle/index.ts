
import { Player } from "../player"
import { Logger } from "../../utils/logger"

import { BattleMode, BattleModeType } from "../../utils/game/battle-mode"
import { EquipmentConstraintsMode } from "../../utils/game/equipment-constraints-mode"

import { SetBattleChatEnabledPacket } from "../../network/packets/set-battle-chat-enabled"
import { SetLoadBattleObjectsPacket } from "../../network/packets/set-load-battle-objects"
import { SetShowBattleNotificationsPacket } from "../../network/packets/set-show-battle-notifications"

import { LayoutState } from "../../utils/game/layout-state"

import { BattlePlayersManager } from "./managers/players"
import { BattleViewersManager } from "./managers/viewers"
import { BattleTeamsManager } from "./managers/teams"
import { BattleUtils } from "../../utils/game/battle"
import { BattleResourcesManager } from "./managers/resources"
import { BattleModeManager } from "./managers/mode"

import { BattleMinesManager } from "./managers/mines"
import { BattleEffectsManager } from "./managers/effects"
import { BattleStatisticsManager } from "./managers/statistics"
import { BattleBoxesManager } from "./managers/boxes"
import { BattleDeathMatchModeManager } from "./managers/mode/modes/death-match"
import { SetRemoveBattleScreenPacket } from "../../network/packets/set-remove-battle-screen"
import { SetUserLeftBattlePacket } from "../../network/packets/set-user-left-battle"
import { SimplePacket } from "../../network/packets/simple-packet"
import { IMap } from "../../managers/maps/types"
import { IBattleData } from "./types"
import { SuspiciousLevel } from "../../utils/game/suspicious-level"
import { IBattleList } from "../../network/packets/set-battle-list"
import { SetBattleTimePacket } from "../../network/packets/set-battle-time"
import { Rank } from "../../utils/game/rank"
import { BattleChatManager } from "./managers/chat"
import { SetUserTankResourcesDataPacket } from "../../network/packets/set-user-tank-resources-data"
import { SetBattleUserLeftNotificationPacket } from "../../network/packets/set-battle-user-left-notification"

export class Battle {

    private battleId: string;
    private running: boolean = false

    private time: number = 0

    private updateInterval: NodeJS.Timeout

    private playersManager: BattlePlayersManager
    private viewersManager: BattleViewersManager
    private teamsManager: BattleTeamsManager
    private chatManager: BattleChatManager

    private modeManager: BattleModeManager
    private statisticsManager: BattleStatisticsManager

    private resourcesManager: BattleResourcesManager

    private minesManager: BattleMinesManager
    private effectsManager: BattleEffectsManager
    private boxesManager: BattleBoxesManager

    public static getManager(battle: Battle) {
        switch (battle.getMode() as BattleModeType) {
            case BattleMode.DM: {
                return new BattleDeathMatchModeManager(battle)
            }
            default: {
                throw new Error(`Unknown battle mode: ${battle.getMode()}`)
            }
        }
    }

    constructor(
        private name: string,
        private map: IMap,
        private data: IBattleData = {
            autoBalance: true,
            battleMode: BattleMode.DM,
            equipmentConstraintsMode: EquipmentConstraintsMode.NONE,
            friendlyFire: false,
            scoreLimit: 20,
            timeLimitInSec: 600,
            maxPeopleCount: 10,
            parkourMode: false,
            privateBattle: false,
            proBattle: false,
            rankRange: { max: Rank.GENERALISSIMO, min: Rank.RECRUIT },
            reArmorEnabled: true,
            withoutBonuses: false,
            withoutCrystals: false,
            withoutSupplies: false
        },
    ) {
        this.battleId = BattleUtils.generateBattleId()
        this.time = this.data.timeLimitInSec

        this.playersManager = new BattlePlayersManager(this)
        this.viewersManager = new BattleViewersManager(this)
        this.teamsManager = new BattleTeamsManager(this)
        this.chatManager = new BattleChatManager(this)

        this.modeManager = Battle.getManager(this)
        this.statisticsManager = new BattleStatisticsManager(this)

        this.resourcesManager = new BattleResourcesManager(this)
        this.minesManager = new BattleMinesManager()
        this.effectsManager = new BattleEffectsManager()
        this.boxesManager = new BattleBoxesManager()

        this.updateInterval = setInterval(this.update.bind(this), 1000)
    }

    public start() {
        this.running = true
    }

    public restart() {
        this.time = this.getTimeLimitInSec()
    }

    public finish() {
        this.running = false
    }

    public close() {
        clearInterval(this.updateInterval)
    }


    public async handleClientJoin(player: Player) {

        if (this.getPlayersManager().hasPlayer(player.getUsername())) {
            Logger.warn(`${player.getUsername()} already joined the battle ${this.getName()}`)
            return false;
        }

        /** ADD PLAYER */
        player.setLayoutState(LayoutState.BATTLE)
        this.getPlayersManager().addPlayer(player);

        /** SEND DATA & RESOURCES */
        await this.resourcesManager.sendResources(player)
        this.resourcesManager.sendBattleMapProperties(player)
        this.resourcesManager.sendTurretsData(player)

        /** SEND PROPERTIES & STATISTICS */
        this.statisticsManager.sendAddUserProperties(player)
        this.statisticsManager.sendBattleData(player)
        this.statisticsManager.sendUserProperties()
        this.statisticsManager.broadcastPlayerStatistics(player)

        /** SEND CHAT */
        this.chatManager.sendEnableChat(player)

        /** SEND IMPORTANT PACKETS */
        this.sendLoadBattleObjects(player)
        this.sendShowBattleNotifications(player)

        /** SEND IN-GAME PROPERTIES */
        this.boxesManager.sendData(player)
        this.minesManager.sendMines(player);

        /** SEND TANKS DATA */
        const tankData = player.getTank().getData();
        this.playersManager.broadcastTankData(tankData)

        this.playersManager.sendTanksData(player)
        this.playersManager.sendTankData(tankData, player)

        /** SEND BATTLE EFFECTS */
        this.effectsManager.sendBattleEffects(player);
        player.getGarageManager().sendSupplies(player);

        player.setSubLayoutState(LayoutState.BATTLE)

        if (!this.isRunning()) {
            this.start()
        }

        Logger.info(`${player.getUsername()} joined the battle ${this.getName()}`)
    }

    public handleClientLeave(player: Player) {

        if (!this.getPlayersManager().hasPlayer(player.getUsername())) {
            Logger.warn(`${player.getUsername()} is not in the battle ${this.getName()}`)
            return false
        }

        this.sendPlayerLeft(player)


        if (player.getTank()) {
            player.getTank().sendRemoveTank();
        }

        this.sendRemoveBattleScreen(player)

        this.getPlayersManager().removePlayer(player.getUsername())
        Logger.info(`${player.getUsername()} left the battle ${this.getName()}`)

    }

    public getBattleId() { return this.battleId }
    public getName() { return this.name }
    public getMap() { return this.map }

    public isRunning() {
        return this.running
    }

    public getTimeLeft(): number {
        return this.isRunning() ? this.time : this.data.timeLimitInSec
    }

    public sendTime() {
        const packet = new SetBattleTimePacket();
        packet.time = this.time;
        this.broadcastPacket(packet)
    }

    public getData() { return this.data }
    public haveAutoBalance() { return this.data.autoBalance }
    public getMode() { return this.data.battleMode }
    public getEquipmentConstraintsMode() { return this.data.equipmentConstraintsMode }
    public isFriendlyFire() { return this.data.friendlyFire }
    public getScoreLimit() { return this.data.scoreLimit }
    public getTimeLimitInSec() { return this.data.timeLimitInSec }
    public getMaxPeopleCount() { return this.data.maxPeopleCount }
    public isParkourMode() { return this.data.parkourMode }
    public isPrivateBattle() { return this.data.privateBattle }
    public isProBattle() { return this.data.proBattle }
    public getRankRange() { return this.data.rankRange }
    public isReArmorEnabled() { return this.data.reArmorEnabled }
    public isWithoutBonuses() { return this.data.withoutBonuses }
    public isWithoutCrystals() { return this.data.withoutCrystals }
    public isWithoutSupplies() { return this.data.withoutSupplies }


    public sendLoadBattleObjects(player: Player) {
        player.sendPacket(new SetLoadBattleObjectsPacket())
    }

    public sendShowBattleNotifications(player: Player) {
        player.sendPacket(new SetShowBattleNotificationsPacket())
    }

    public sendRemoveBattleScreen(player: Player) {
        const setRemoveBattleScreenPacket = new SetRemoveBattleScreenPacket()
        player.sendPacket(setRemoveBattleScreenPacket)
    }

    public sendPlayerLeft(player: Player) {
        // const setUserLeftBattlePacket = new SetUserLeftBattlePacket()
        // setUserLeftBattlePacket.userId = player.getUsername()
        // this.broadcastPacket(setUserLeftBattlePacket)
        const packet = new SetBattleUserLeftNotificationPacket();
        packet.userId = player.getUsername();
        this.broadcastPacket(packet);
    }

    public toBattleListItem(): IBattleList {
        return {
            battleId: this.getBattleId(),
            battleMode: this.data.battleMode,
            map: this.map.mapId,
            maxPeople: this.data.maxPeopleCount,
            name: this.getName(),
            privateBattle: this.isProBattle(),
            proBattle: this.isProBattle(),
            minRank: this.getRankRange().min,
            maxRank: this.getRankRange().max,
            preview: this.map.preview,
            parkourMode: this.isParkourMode(),
            equipmentConstraintsMode: this.getEquipmentConstraintsMode(),
            suspicionLevel: SuspiciousLevel.NONE,
            users: this.playersManager.getPlayers().map(player => player.getUsername())
        }
    }

    public broadcastPacket(packet: SimplePacket, ignore: string[] = []) {
        for (const player of this.getPlayersManager().getPlayers()) {
            if (!ignore.includes(player.getUsername())) {
                player.sendPacket(packet)
            }
        }
    }

    public getPlayersManager(): BattlePlayersManager {
        return this.playersManager
    }

    public getViewersManager(): BattleViewersManager {
        return this.viewersManager
    }
    public getTeamsManager(): BattleTeamsManager {
        return this.teamsManager
    }

    public getChatManager(): BattleChatManager {
        return this.chatManager
    }

    public getModeManager(): BattleModeManager {
        return this.modeManager
    }

    public getResourcesManager(): BattleResourcesManager {
        return this.resourcesManager
    }

    public getMinesManager(): BattleMinesManager {
        return this.minesManager
    }

    public getEffectsManager(): BattleEffectsManager {
        return this.effectsManager
    }

    public getStatisticsManager(): BattleStatisticsManager {
        return this.statisticsManager
    }

    public getBoxesManager(): BattleBoxesManager {
        return this.boxesManager
    }

    public update() {
        if (this.isRunning()) {
            this.time--;
        }

        for (const player of this.getPlayersManager().getPlayers()) {
            player.sendLatency()
        }
    }

}