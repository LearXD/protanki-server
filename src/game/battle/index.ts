
import { Player } from "../player"
import { Logger } from "../../utils/logger"

import { BattleMode } from "../../states/battle-mode"
import { EquipmentConstraintsMode } from "../../states/equipment-constraints-mode"

import { SetLoadBattleObjectsPacket } from "../../network/packets/set-load-battle-objects"
import { SetShowBattleNotificationsPacket } from "../../network/packets/set-show-battle-notifications"

import { LayoutState } from "../../states/layout-state"
import { BattleUtils } from "../../utils/battle"
import { SetRemoveBattleScreenPacket } from "../../network/packets/set-remove-battle-screen"
import { SimplePacket } from "../../network/packets/simple-packet"

import { IBattleData } from "./types"
import { SuspiciousLevel } from "../../states/suspicious-level"
import { IBattleList } from "../../network/packets/set-battle-list"
import { SetBattleTimePacket } from "../../network/packets/set-battle-time"
import { Rank } from "../../states/rank"
import { SetBattleUserLeftNotificationPacket } from "../../network/packets/set-battle-user-left-notification"
import { BattleManager } from "./utils/managers"
import { IMap } from "@/server/managers/maps/types"
import { TimeType } from "./managers/task/types"

export class Battle extends BattleManager {

    public static readonly TICK_RATE = 10

    private battleId: string;
    private running: boolean = false

    private startedAt: number;
    private tick: number = 0

    private updateInterval: NodeJS.Timeout
    private updateTimeInterval: NodeJS.Timeout

    public constructor(
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
        super();

        this.battleId = BattleUtils.generateBattleId()
        this.registerManagers(this);

        this.updateInterval = setInterval(this.update.bind(this), 1000 / Battle.TICK_RATE);
        this.updateTimeInterval = setInterval(this.updateTime.bind(this), 1000);
    }

    public start() {
        this.startedAt = Date.now()
        this.running = true
    }

    public restart() {

        if (this.getPlayersManager().getPlayers().length === 0) {
            return;
        }

        this.startedAt = Date.now()
        this.running = true

        this.restartTime();

        for (const player of this.getPlayersManager().getPlayers()) {
            player.getTank().prepareRespawn();
        }
    }

    public finish() {
        this.running = false

        this.taskManager.unregisterAll();
        this.getStatisticsManager().sendFinishRewards()

        this.taskManager.registerTask(this.restart.bind(this), 10, TimeType.SECONDS)
    }

    public close() {
        clearInterval(this.updateInterval)
    }


    public async handlePlayerJoin(player: Player, spectator: boolean = false) {

        if (this.getPlayersManager().hasPlayer(player) || this.getPlayersManager().hasSpectator(player)) {
            Logger.warn(`${player.getUsername()} already joined the battle ${this.getName()}`)
            return false;
        }

        /** ADD PLAYER */
        player.setBattle(this)
        player.setLayoutState(LayoutState.BATTLE)

        if (spectator) {
            this.getPlayersManager().addSpectator(player)
        }

        if (!spectator) {
            if (!this.isRunning()) this.start()

            this.getPlayersManager().addPlayer(player);
            this.getStatisticsManager().addPlayer(player)
        }

        /** SEND DATA & RESOURCES */
        await this.resourcesManager.sendResources(player)
        this.resourcesManager.sendBattleMapProperties(player, spectator)
        this.resourcesManager.sendTurretsData(player)

        /** SEND PROPERTIES & STATISTICS */
        this.statisticsManager.sendBattleData(player, true)
        this.statisticsManager.sendUserProperties(player)
        if (!spectator) {
            this.statisticsManager.sendAddUserProperties(player)
            this.statisticsManager.broadcastPlayerStatistics(player)
        }

        /** SEND CHAT */
        this.chatManager.sendEnableChat(player)

        /** SEND IMPORTANT PACKETS */
        this.sendLoadBattleObjects(player)
        this.sendShowBattleNotifications(player)


        /** SEND IN-GAME PROPERTIES */
        this.boxesManager.sendData(player)
        this.minesManager.sendMines(player);

        /** SEND TANKS DATA */
        this.playersManager.sendTanksData(player)
        if (!spectator) {
            const tankData = player.getTank().getData();
            this.playersManager.broadcastTankData(tankData)
            this.playersManager.sendTankData(tankData, player)
        }

        /** SEND BATTLE EFFECTS */
        this.effectsManager.sendBattleEffects(player);
        if (!spectator) {
            player.getGarageManager().sendSupplies(player);
        }

        player.setSubLayoutState(LayoutState.BATTLE)

        Logger.info(`${player.getUsername()} joined the battle ${this.getName()}`)
    }

    public handleClientLeave(player: Player) {

        if (!this.getPlayersManager().hasPlayer(player) && !this.getPlayersManager().hasSpectator(player)) {
            Logger.warn(`${player.getUsername()} is not in the battle ${this.getName()}`)
            return false
        }

        if (this.getPlayersManager().hasPlayer(player)) {
            if (player.getTank()) {
                player.getTank().sendRemoveTank(true);
            }

            this.sendPlayerLeft(player)

            this.getStatisticsManager().removePlayer(player.getUsername());
            this.getPlayersManager().removePlayer(player)
        }

        if (this.getPlayersManager().hasSpectator(player)) {
            this.getPlayersManager().removeSpectator(player)
        }

        this.sendRemoveBattleScreen(player)

        player.tank = null
        player.setBattle(null)

        Logger.info(`${player.getUsername()} left the battle ${this.getName()}`)

    }

    public getBattleId() { return this.battleId }

    public getName() { return this.name }
    public getMap() { return this.map }

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
            privateBattle: this.isPrivateBattle(),
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
        for (const player of this.getPlayersManager().getAll()) {
            if (!ignore.includes(player.getUsername())) {
                player.sendPacket(packet)
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

        if (this.playersManager.getPlayers().length > 0) {
            Logger.debug(`Battle ${this.getName()}. Time left: ${this.getTimeLeft()}`)
        }
    }

    public async update() {
        this.tick++

        this.taskManager.update()

        if (this.tick % Battle.TICK_RATE === 0) {
            for (const player of this.getPlayersManager().getPlayers()) {
                player.sendLatency()
            }
        }
    }

}