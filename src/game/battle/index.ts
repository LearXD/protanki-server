
import { Player } from "../player"
import { Logger } from "../../utils/logger"

import { BattleMode, BattleModeType } from "../../utils/game/battle-mode"
import { EquipmentConstraintsMode } from "../../utils/game/equipment-constraints-mode"

import { SetBattleChatEnabledPacket } from "../../network/packets/set-battle-chat-enabled"
import { SetSomePacketOnJoinBattle4Packet } from "../../network/packets/set-some-packet-on-join-battle-4"
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

export class Battle {

    private battleId: string;
    private roundStarted: boolean = false

    private updateInterval: NodeJS.Timeout

    private playersManager: BattlePlayersManager
    private viewersManager: BattleViewersManager
    private teamsManager: BattleTeamsManager

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
            rankRange: { max: 30, min: 1 },
            reArmorEnabled: true,
            withoutBonuses: false,
            withoutCrystals: false,
            withoutSupplies: false
        },
    ) {
        this.battleId = BattleUtils.generateBattleId()

        this.playersManager = new BattlePlayersManager(this)
        this.viewersManager = new BattleViewersManager(this)
        this.teamsManager = new BattleTeamsManager(this)

        this.modeManager = Battle.getManager(this)
        this.statisticsManager = new BattleStatisticsManager(this)

        this.resourcesManager = new BattleResourcesManager(this)
        this.minesManager = new BattleMinesManager()
        this.effectsManager = new BattleEffectsManager()
        this.boxesManager = new BattleBoxesManager()

        this.updateInterval = setInterval(this.update.bind(this), 1000)
    }

    public async handleClientJoin(client: Player) {

        if (this.getPlayersManager().hasPlayer(client.getUsername())) {
            Logger.warn(`${client.getUsername()} already joined the battle ${this.getName()}`)
            return
        }

        client.setLayoutState(LayoutState.BATTLE)
        this.getPlayersManager().addPlayer(client);

        await this.resourcesManager.sendObjectsResources(client)
        await this.resourcesManager.sendSkyboxResource(client)
        await this.resourcesManager.sendMapResources(client)

        this.resourcesManager.sendBattleData(client)
        this.statisticsManager.sendBattleStatistics(client)
        this.modeManager.sendPlayerStatistics(client)
        this.statisticsManager.sendPlayerStatistics(client)

        const setBattleChatEnabledPacket = new SetBattleChatEnabledPacket();
        client.sendPacket(setBattleChatEnabledPacket);

        const setSomePacketOnJoinBattle4Packet = new SetSomePacketOnJoinBattle4Packet();
        client.sendPacket(setSomePacketOnJoinBattle4Packet);

        const setShowBattleNotificationsPacket = new SetShowBattleNotificationsPacket();
        client.sendPacket(setShowBattleNotificationsPacket);

        this.resourcesManager.sendTurretsData(client)

        this.boxesManager.sendBoxes(client)
        this.minesManager.sendMinesData(client);
        this.effectsManager.sendBattleEffects(client)
        this.boxesManager.sendSpawnedBoxes(client)

        client.getGarageManager().sendSupplies(client);

        this.playersManager.sendPlayerData(client)
        client.setSubLayoutState(LayoutState.BATTLE)

        Logger.info(`${client.getUsername()} joined the battle ${this.getName()}`)
    }

    public handleClientLeave(client: Player) {

        if (!this.getPlayersManager().hasPlayer(client.getUsername())) {
            Logger.warn(`${client.getUsername()} is not in the battle ${this.getName()}`)
            return
        }

        this.sendPlayerLeft(client)
        this.sendRemoveBattleScreen(client)

        this.getPlayersManager().removePlayer(client.getUsername())
    }

    public start() {

    }

    public restart() {

    }

    public finish() {

    }

    public close() {
        clearInterval(this.updateInterval)
    }

    public getBattleId() { return this.battleId }
    public getName() { return this.name }
    public getMap() { return this.map }

    public isStarted() {
        return this.roundStarted
    }

    public getTimeLeft(): number {
        return this.isStarted() ? this.data.timeLimitInSec : 60
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

    public getPlayersManager(): BattlePlayersManager {
        return this.playersManager
    }

    public getViewersManager(): BattleViewersManager {
        return this.viewersManager
    }
    public getTeamsManager(): BattleTeamsManager {
        return this.teamsManager
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

    public sendRemoveBattleScreen(player: Player) {
        const setRemoveBattleScreenPacket = new SetRemoveBattleScreenPacket()
        player.sendPacket(setRemoveBattleScreenPacket)
    }

    public sendPlayerLeft(player: Player) {
        const setUserLeftBattlePacket = new SetUserLeftBattlePacket()
        setUserLeftBattlePacket.userId = player.getUsername()
        this.broadcastPacket(setUserLeftBattlePacket)
    }

    public broadcastPacket(packet: SimplePacket) {
        for (const player of this.getPlayersManager().getPlayers()) {
            player.sendPacket(packet)
        }
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
            users: []
        }
    }

    public update() {
        for (const player of this.getPlayersManager().getPlayers()) {
        }
    }

}