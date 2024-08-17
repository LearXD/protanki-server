
import { Player } from "../player"
import { Logger } from "../../utils/logger"

import { BattleMode } from "../../states/battle-mode"
import { EquipmentConstraintsMode } from "../../states/equipment-constraints-mode"

import { SetShowBattleNotificationsPacket } from "../../network/packets/set-show-battle-notifications"

import { LayoutState } from "../../states/layout-state"

import { SetRemoveBattleScreenPacket } from "../../network/packets/set-remove-battle-screen"

import { IBattleData } from "./types"
import { SuspiciousLevel } from "../../states/suspicious-level"
import { IBattleList } from "../../network/packets/set-battle-list"
import { SetBattleTimePacket } from "../../network/packets/set-battle-time"
import { Rank } from "../../states/rank"
import { TimeType } from "./managers/task/types"
import { BattleUtils } from "./utils/battle"
import { Team, TeamType } from "@/states/team"
import { Tank } from "../tank"
import { Map } from "../map"
import { SetBattleStartedPacket } from "@/network/packets/set-battle-started"
import { Server } from "@/server"
import { SetBattleEndedPacket } from "@/network/packets/set-battle-ended"
import { BattleModeManager } from "./managers/mode"
import { BattleCollisionsManager } from "./managers/collisions"
import { BattleCombatManager } from "./managers/combat"
import { BattlePlayersManager } from "./managers/players"
import { BattleViewersManager } from "./managers/viewers"
import { BattleChatManager } from "./managers/chat"
import { BattleResourcesManager } from "./managers/resources"
import { BattleMinesManager } from "./managers/mines"
import { BattleEffectsManager } from "./managers/effects"
import { BattleBoxesManager } from "./managers/boxes"
import { BattleTaskManager } from "./managers/task"
import { Packet } from "@/network/packets/packet"

export class Battle {

    public static readonly TICK_RATE = 10

    public readonly battleId: string = BattleUtils.generateBattleId();
    private running: boolean = false

    private startedAt: number;
    private tick: number = 0

    private updateInterval: NodeJS.Timeout
    private updateTimeInterval: NodeJS.Timeout

    /** Managers */
    public readonly modeManager: BattleModeManager = BattleUtils.getBattleManager(this)
    public readonly collisionManager: BattleCollisionsManager = new BattleCollisionsManager(this)
    public readonly combatManager: BattleCombatManager = new BattleCombatManager(this)
    public readonly playersManager: BattlePlayersManager = new BattlePlayersManager(this)
    public readonly viewersManager: BattleViewersManager = new BattleViewersManager(this)
    public readonly chatManager: BattleChatManager = new BattleChatManager(this)
    public readonly resourcesManager: BattleResourcesManager = new BattleResourcesManager(this)
    public readonly minesManager: BattleMinesManager = new BattleMinesManager(this)
    public readonly effectsManager: BattleEffectsManager = new BattleEffectsManager(this)
    public readonly boxesManager: BattleBoxesManager = new BattleBoxesManager(this)
    public readonly taskManager: BattleTaskManager = new BattleTaskManager()

    public constructor(
        private readonly server: Server,
        public name: string,
        private map: Map,
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
        this.modeManager.init();
        this.updateInterval = setInterval(this.update.bind(this), 1000 / Battle.TICK_RATE);
        this.updateTimeInterval = setInterval(this.updateTime.bind(this), 1000);
    }

    public start() {
        Logger.info(`Battle ${this.getName()} started`)

        this.sendStarted()

        this.startedAt = Date.now()
        this.running = true
    }

    public restart() {
        Logger.info(`Battle ${this.getName()} restarted`)

        this.modeManager.init();

        if (this.playersManager.getPlayers().length === 0) {
            return;
        }

        this.sendStarted()
        this.startedAt = Date.now()
        this.running = true

        this.restartTime();

        for (const player of this.playersManager.getPlayers()) {
            player.tank.alive = false;
            player.tank.visible = false;
            player.tank.prepareRespawn();
        }
    }

    public finish() {
        Logger.info(`Battle ${this.getName()} finished`)

        const packet = new SetBattleEndedPacket();
        packet.battle = this.getBattleId();
        this.server.battleManager.broadcastPacket(packet)

        this.running = false

        this.taskManager.unregisterAll();
        this.modeManager.sendFinishRewards()

        this.taskManager.scheduleTask(this.restart.bind(this), 10 * TimeType.SECONDS)
    }

    public close() {
        clearInterval(this.updateInterval)
        clearInterval(this.updateTimeInterval)
    }

    public async handlePlayerJoin(player: Player, team: TeamType = Team.NONE) {

        const isSpectator = team === Team.SPECTATOR

        if (this.playersManager.hasPlayer(player) || this.playersManager.hasSpectator(player)) {
            Logger.warn(`${player.getUsername()} already joined the battle ${this.getName()}`)
            return false;
        }

        /** ADD PLAYER */
        player.setLayoutState(LayoutState.BATTLE)
        this.playersManager.addPlayer(player, team);

        if (!isSpectator && !this.running) this.start()

        /** SEND DATA & RESOURCES */
        await this.map.sendResources(player)
        this.map.sendProperties(player, isSpectator)
        this.resourcesManager.sendTurretsData(player)

        /** SEND PROPERTIES & STATISTICS */
        this.modeManager.sendBattleData(player, isSpectator)
        this.modeManager.sendUsersProperties(player)
        if (!isSpectator) {
            this.modeManager.broadcastAddUserProperties(player)
            this.modeManager.broadcastUserStats(player)
        }

        /** SEND CHAT */
        this.chatManager.sendEnableChat(player)

        /** SEND IMPORTANT PACKETS */
        this.modeManager.sendLoadBattleMode(player)
        this.sendShowBattleNotifications(player)

        /** SEND IN-GAME PROPERTIES */
        this.boxesManager.sendData(player)
        this.minesManager.sendMines(player);

        /** SEND TANKS DATA */
        this.playersManager.sendTanksData(player)
        if (!isSpectator) {
            this.playersManager.broadcastTankData(player.tank.getData())
        }

        /** SEND BATTLE EFFECTS */
        this.effectsManager.sendBattleEffects(player);
        if (!isSpectator) {
            if (!this.isWithoutSupplies()) {
                player.garageManager.sendSupplies();
            }
        }

        player.setSubLayoutState(LayoutState.BATTLE)

        Logger.info(`${player.getUsername()} joined the battle ${this.getName()}`)
    }

    public handleClientLeave(player: Player) {

        if (!this.playersManager.hasPlayer(player) && !this.playersManager.hasSpectator(player)) {
            Logger.warn(`${player.getUsername()} is not in the battle ${this.getName()}`)
            return false
        }

        if (this.playersManager.hasPlayer(player)) {
            if (player.tank) {
                player.tank.sendRemoveTank(true);
            }

            this.minesManager.removePlayerMines(player)
            this.modeManager.broadcastRemovePlayer(player)
        }

        this.playersManager.removePlayer(player)

        this.sendRemoveBattleScreen(player)
        this.taskManager.unregisterOwnerTasks(player.getUsername())

        player.tank = null
        player.battle = null

        Logger.info(`${player.getUsername()} left the battle ${this.getName()}`)

    }

    public getBattleId() { return this.battleId }

    public getName() { return this.name }
    public getMap(): Map { return this.map }

    public isRunning() {
        return this.running
    }

    public getTimeLeft(): number {
        if (this.running) {
            return this.getTimeLimitInSec() - (Date.now() - this.startedAt) / 1000
        }
        return this.getTimeLimitInSec()
    }

    public restartTime() {
        const packet = new SetBattleTimePacket();
        packet.time = this.getTimeLeft();
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

    public sendStarted() {
        const packet = new SetBattleStartedPacket();
        packet.battleId = this.getBattleId();
        this.server.battleManager.broadcastPacket(packet)
    }

    public sendShowBattleNotifications(player: Player) {
        player.sendPacket(new SetShowBattleNotificationsPacket())
    }

    public sendRemoveBattleScreen(player: Player) {
        const setRemoveBattleScreenPacket = new SetRemoveBattleScreenPacket()
        player.sendPacket(setRemoveBattleScreenPacket)
    }

    public toBattleListItem(): IBattleList {
        const item: IBattleList = {
            battleId: this.getBattleId(),
            battleMode: this.data.battleMode,
            map: this.map.getId(),
            maxPeople: this.data.maxPeopleCount,
            name: this.getName(),
            privateBattle: this.isPrivateBattle(),
            proBattle: this.isProBattle(),
            minRank: this.getRankRange().min,
            maxRank: this.getRankRange().max,
            preview: this.map.getPreview(),
            parkourMode: this.isParkourMode(),
            equipmentConstraintsMode: this.getEquipmentConstraintsMode(),
            suspicionLevel: SuspiciousLevel.NONE
        }

        if (this.getMode() === BattleMode.DM) {
            item.users = this.playersManager.getPlayers().map(player => player.getUsername())
        }

        if (this.getMode() !== BattleMode.DM) {
            item.usersBlue = this.playersManager.getPlayers().filter(player => player.tank.team === Team.BLUE).map(player => player.getUsername())
            item.usersRed = this.playersManager.getPlayers().filter(player => player.tank.team === Team.RED).map(player => player.getUsername())
        }

        return item
    }

    public broadcastPacket(packet: Packet, ignore: string[] = []) {
        for (const player of this.playersManager.getAll()) {
            if (!ignore.includes(player.getUsername())) {
                player.sendPacket(packet)
            }
        }
    }

    public broadcastPacketToTeam(packet: Packet, team: TeamType, ignore: string[] = []) {
        for (const player of this.playersManager.getPlayers()) {
            if (player.tank.team === team) {
                if (!ignore.includes(player.getUsername())) {
                    player.sendPacket(packet)
                }
            }
        }
    }

    public updateTime() {
        if (this.getTimeLeft() <= 0) {
            if (this.running) {
                this.finish()
            }
            return;
        }
    }

    public async update() {
        this.tick++

        this.taskManager.update()

        if (this.tick % (Battle.TICK_RATE * 2) === 0) {
            for (const player of this.playersManager.getPlayers()) {
                player.tank.sendLatency()
            }
        }
    }

}