
import { Client } from "../client"
import { Logger } from "../../utils/logger"

import { IMap } from "../../managers/maps"
import { IBattleList } from "../../network/packets/set-battle-list"
import { BattleMode, BattleModes } from "../../utils/game/battle-mode"
import { EquipmentConstraintsMode, EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode"
import { ByteArray } from "../../utils/network/byte-array"

import { SetBattleChatEnabledPacket } from "../../network/packets/set-battle-chat-enabled"
import { SetSomePacketOnJoinBattle4Packet } from "../../network/packets/set-some-packet-on-join-battle-4"
import { SetSomePacketOnJoinBattle5Packet } from "../../network/packets/set-some-packet-on-join-battle-5"

import { LayoutState } from "../../utils/game/layout-state"

import { BattlePlayersManager } from "./managers/players"
import { BattleViewersManager } from "./managers/viewers"
import { BattleTeamsManager } from "./managers/teams"
import { BattleUtils } from "../../utils/game/battle"
import { BattleResourcesManager } from "./managers/resources"
import { BattleModeManager } from "./managers/mode"

import { BattleMinesManager } from "./managers/mines"
import { BattleEffectsManager } from "./managers/effetcs"
import { BattleStatisticsManager } from "./managers/statistics"
import { BattleBoxesManager } from "./managers/boxes"
import { BattleDeathMatchModeManager } from "./managers/mode/modes/death-match"

export interface IBattleData {
    autoBalance: boolean,
    battleMode: BattleModes,
    equipmentConstraintsMode: EquipmentConstraintsModes,
    friendlyFire: boolean,
    scoreLimit: number,
    timeLimitInSec: number,
    maxPeopleCount: number,
    parkourMode: boolean,
    privateBattle: boolean,
    proBattle: boolean,
    rankRange: {
        max: number,
        min: number
    },
    reArmorEnabled: boolean,
    withoutBonuses: boolean,
    withoutCrystals: boolean,
    withoutSupplies: boolean
}

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
        switch (battle.getMode() as BattleModes) {
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

        // GET MANAGER BY BATTLE MODE
        this.modeManager = Battle.getManager(this)
        this.statisticsManager = new BattleStatisticsManager(this)

        this.resourcesManager = new BattleResourcesManager(this)
        this.minesManager = new BattleMinesManager()
        this.effectsManager = new BattleEffectsManager()
        this.boxesManager = new BattleBoxesManager()

        this.updateInterval = setInterval(this.update.bind(this), 1000)
    }

    public start() { }

    public finish() { }

    public close() {
        clearInterval(this.updateInterval)
    }

    public getBattleId() { return this.battleId }

    public getName() { return this.name }
    public getMap() { return this.map }
    public getData() { return this.data }

    public getMode() { return this.data.battleMode }
    public getEquipmentConstraintsMode() { return this.data.equipmentConstraintsMode }

    public isStarted() { return this.roundStarted }

    public getPlayersManager(): BattlePlayersManager { return this.playersManager }
    public getViewersManager(): BattleViewersManager { return this.viewersManager }
    public getTeamsManager(): BattleTeamsManager { return this.teamsManager }

    public getModeManager(): BattleModeManager { return this.modeManager }
    public getResourcesManager(): BattleResourcesManager { return this.resourcesManager }
    public getMinesManager(): BattleMinesManager { return this.minesManager }
    public getEffectsManager(): BattleEffectsManager { return this.effectsManager }
    public getStatisticsManager(): BattleStatisticsManager { return this.statisticsManager }
    public getBoxesManager(): BattleBoxesManager { return this.boxesManager }


    public getTimeLeft(): number {
        return this.isStarted() ? this.data.timeLimitInSec : 60
    }


    public async handleClientJoin(client: Client) {

        if (!this.getPlayersManager().addPlayer(client)) {
            return;
        }

        Logger.info('BATTLE', `${client.getUsername()} joined the battle ${this.getName()}`)

        this.statisticsManager.initPlayer(client.getUsername())

        await this.resourcesManager.sendObjectsResources(client)
        await this.resourcesManager.sendSkyboxResources(client)
        await this.resourcesManager.sendMapResources(client)

        this.resourcesManager.sendTurretsData(client)
        this.boxesManager.sendBoxesData(client)
        this.resourcesManager.sendBattleData(client)

        this.statisticsManager.sendBattleStatistics(client)

        const setBattleChatEnabledPacket = new SetBattleChatEnabledPacket(new ByteArray());
        client.sendPacket(setBattleChatEnabledPacket);

        const setSomePacketOnJoinBattle4Packet = new SetSomePacketOnJoinBattle4Packet(new ByteArray());
        client.sendPacket(setSomePacketOnJoinBattle4Packet);

        this.modeManager.sendPlayerStatistics(client)

        const setSomePacketOnJoinBattle5Packet = new SetSomePacketOnJoinBattle5Packet(new ByteArray());
        client.sendPacket(setSomePacketOnJoinBattle5Packet);

        this.minesManager.sendMinesData(client);

        client.getServer().getUserDataManager().sendSupplies(client);

        this.playersManager.sendPlayerData(client)

        this.statisticsManager.sendPlayerStatistics(client)
        this.effectsManager.sendBattleEffects(client)

        this.boxesManager.sendSpawnedBoxes(client)

        client.setSubLayoutState(
            LayoutState.BATTLE, LayoutState.BATTLE
        )
    }

    public toBattleListItem(): IBattleList {
        return {
            battleId: this.getBattleId(),
            battleMode: this.data.battleMode,
            map: this.map.mapId,
            maxPeople: this.data.maxPeopleCount,
            name: this.getName(),
            privateBattle: this.data.privateBattle,
            proBattle: this.data.proBattle,
            minRank: this.data.rankRange.min,
            maxRank: this.data.rankRange.max,
            preview: this.map.preview,
            parkourMode: this.data.parkourMode,
            equipmentConstraintsMode: this.data.equipmentConstraintsMode,
            suspicionLevel: 'NONE',
            usersBlue: [],
            usersRed: []
        }
    }

    public update() {
        for (const player of this.getPlayersManager().getPlayers()) {
        }
    }

}