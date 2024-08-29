
import { Player } from "../player"
import { Logger } from "../../utils/logger"
import { BattleMode } from "../../states/battle-mode"
import { EquipmentConstraintsMode } from "../../states/equipment-constraints-mode"
import { SetShowBattleNotificationsPacket } from "../../network/packets/set-show-battle-notifications"
import { LayoutState } from "../../states/layout-state"
import { SetRemoveBattleScreenPacket } from "../../network/packets/set-remove-battle-screen"
import { IBattleData } from "./types"
import { SetBattleTimePacket } from "../../network/packets/set-battle-time"
import { Rank } from "../../states/rank"
import { TimeType } from "./managers/task/types"
import { BattleUtils } from "./utils/battle"
import { Team, TeamType } from "@/states/team"
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
import { BattleMinesManager } from "./managers/mines"
import { BattleEffectsManager } from "./managers/effects"
import { BattleBoxesManager } from "./managers/boxes"
import { BattleTaskManager } from "./managers/task"
import { Packet } from "@/network/packets/packet"

export class Battle {

    public readonly battleId: string = BattleUtils.generateBattleId();

    public running: boolean = false
    public startedAt: number = null;

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
    public readonly minesManager: BattleMinesManager = new BattleMinesManager(this)
    public readonly effectsManager: BattleEffectsManager = new BattleEffectsManager(this)
    public readonly boxesManager: BattleBoxesManager = new BattleBoxesManager(this)
    public readonly taskManager: BattleTaskManager = new BattleTaskManager()

    public static readonly TICK_RATE = 10
    public static readonly DEFAULT_CONFIG: IBattleData = {
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
    }

    public constructor(
        public name: string,
        public readonly map: Map,
        public readonly data: IBattleData = Battle.DEFAULT_CONFIG,
        public readonly server: Server,
        public readonly owner?: string
    ) {
        this.modeManager.init();
        this.updateInterval = setInterval(this.update.bind(this), 1000 / Battle.TICK_RATE);
    }

    public getData() {
        return this.data
    }

    public haveAutoBalance() {
        return this.data.autoBalance
    }

    public getMode() {
        return this.data.battleMode
    }

    public getEquipmentConstraintsMode() {
        return this.data.equipmentConstraintsMode
    }

    public isFriendlyFire() {
        return this.data.friendlyFire
    }

    public getScoreLimit() {
        return this.data.scoreLimit
    }

    public getTimeLimitInSec() {
        return this.data.timeLimitInSec
    }

    public getMaxPeopleCount() {
        return this.data.maxPeopleCount
    }

    public isParkourMode() {
        return this.data.parkourMode
    }

    public isPrivateBattle() {
        return this.data.privateBattle
    }

    public isProBattle() {
        return this.data.proBattle
    }

    public getRankRange() {
        return this.data.rankRange
    }

    public isReArmorEnabled() {
        return this.data.reArmorEnabled
    }

    public isWithoutBonuses() {
        return this.data.withoutBonuses
    }

    public isWithoutCrystals() {
        return this.data.withoutCrystals
    }

    public isWithoutSupplies() {
        return this.data.withoutSupplies
    }

    public restartTime() {
        const packet = new SetBattleTimePacket();
        packet.time = this.getTimeLeft();
        this.broadcastPacket(packet)
    }

    public getTimeLeft(): number {
        if (this.getTimeLimitInSec() > 0) {
            if (this.running) {
                return this.getTimeLimitInSec() - (Date.now() - this.startedAt) / 1000
            }
            return this.getTimeLimitInSec()
        }

        return 0
    }

    public start() {
        Logger.info(`Battle ${this.name} started`)

        const packet = new SetBattleStartedPacket();
        packet.battleId = this.battleId;
        this.server.battles.broadcastPacket(packet)

        this.startedAt = Date.now()
        this.running = true

        if (this.isWithoutBonuses() === false) {
            this.boxesManager.initTasks()
        }
    }

    public restart() {
        Logger.info(`Battle ${this.name} restarted`)
        this.modeManager.init();

        this.start()
        this.restartTime();

        for (const player of this.playersManager.getPlayers()) {
            player.tank.prepareRespawn();
        }
    }

    public finish() {
        Logger.info(`Battle ${this.name} finished`)

        const packet = new SetBattleEndedPacket();
        packet.battle = this.battleId;
        this.server.battles.broadcastPacket(packet)

        this.running = false

        this.taskManager.unregisterAll();
        this.modeManager.sendFinishRewards()

        this.taskManager.scheduleTask(this.restart.bind(this), 10 * TimeType.SECONDS)
    }

    public close() {
        clearInterval(this.updateInterval)
        clearInterval(this.updateTimeInterval)
    }

    public async onPlayerJoin(player: Player, team: TeamType = Team.NONE) {

        const isSpectator = team === Team.SPECTATOR

        if (this.playersManager.hasPlayer(player) || this.playersManager.hasSpectator(player)) {
            Logger.warn(`${player.getName()} already joined the battle ${this.name}`)
            return false;
        }

        /** ADD PLAYER */
        player.setLayoutState(LayoutState.BATTLE)
        this.playersManager.addPlayer(player, team);

        if (
            isSpectator === false && this.running === false &&
            this.startedAt === null
        ) {
            this.start()
        }

        /** SEND DATA & RESOURCES */
        await this.map.sendResources(player)
        this.map.sendProperties(player, isSpectator)
        this.server.garage.sendTurretsProperties(player)

        /** SEND PROPERTIES & STATISTICS */
        this.modeManager.sendBattleData(player, isSpectator)
        this.modeManager.sendUsersProperties(player)
        if (!isSpectator) {
            this.modeManager.onPlayerJoin(player)
            this.modeManager.broadcastUserStats(player)
        }

        /** SEND CHAT */
        this.chatManager.sendEnableChat(player)

        /** SEND IMPORTANT PACKETS */
        this.modeManager.sendLoadBattleMode(player)
        player.sendPacket(new SetShowBattleNotificationsPacket())

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
            if (this.isWithoutSupplies() === false) {
                player.garage.sendSupplies();
            }
        }

        player.setSubLayoutState(LayoutState.BATTLE)

        Logger.info(`${player.getName()} joined the battle ${this.name}`)
    }

    public onPlayerLeave(player: Player) {
        if (!this.playersManager.hasPlayer(player) && !this.playersManager.hasSpectator(player)) {
            Logger.warn(`${player.getName()} is not in the battle ${this.name}`)
            return false
        }

        if (this.playersManager.hasPlayer(player)) {

            this.minesManager.removePlayerMines(player)

            this.collisionManager.onPlayerLeave(player)
            this.modeManager.onPlayerLeave(player)

            if (player.tank) {
                player.tank.sendRemoveTank(true);
                player.tank = null
            }
        }

        this.playersManager.removePlayer(player)

        player.sendPacket(new SetRemoveBattleScreenPacket())
        this.taskManager.unregisterOwnerTasks(player.getName())

        player.battle = null

        Logger.info(`${player.getName()} left the battle ${this.name}`)
    }

    public onPlayerDeath(player: Player) {
        this.collisionManager.onPlayerLeave(player)
    }

    public broadcastPacket(packet: Packet, ignore: string[] = []) {
        for (const player of this.playersManager.getAll()) {
            if (!ignore.includes(player.getName())) {
                player.sendPacket(packet)
            }
        }
    }

    public broadcastPacketToTeam(packet: Packet, team: TeamType, ignore: string[] = []) {
        for (const player of this.playersManager.getPlayers()) {
            if (player.tank.team === team) {
                if (!ignore.includes(player.getName())) {
                    player.sendPacket(packet)
                }
            }
        }
    }

    public async update() {

        this.tick++

        this.taskManager.update()
        this.collisionManager.update(this.tick)

        if (this.tick % Battle.TICK_RATE === 0) {
            this.boxesManager.update()

            if (this.getTimeLimitInSec() > 0 && this.getTimeLeft() <= 0) {
                if (this.running) {
                    this.finish()
                }
                return;
            }
        }

        if (this.tick % (Battle.TICK_RATE * 2) === 0) {
            for (const player of this.playersManager.getPlayers()) {
                if (player.tank) {
                    player.tank.sendLatency()
                }
            }
        }
    }

}