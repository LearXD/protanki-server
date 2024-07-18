import { Battle } from "../..";
import { SetBattleStatisticsCCPacket } from "../../../../network/packets/set-battle-statistics-cc";
import { SetBattleUserStatusPacket } from "../../../../network/packets/set-battle-user-status";
import { Player } from "../../../player";

export class BattleStatisticsManager {

    private fund: number = 0
    private time: number = 0

    private scores: Map<string, number> = new Map()
    private kills: Map<string, number> = new Map()
    private deaths: Map<string, number> = new Map()

    public constructor(
        private readonly battle: Battle
    ) { }

    public reset() {
        this.fund = 0
        this.time = 0

        for (const player of this.scores.keys()) {
            this.scores.set(player, 0)
        }

        for (const player of this.kills.keys()) {
            this.kills.set(player, 0)
        }

        for (const player of this.deaths.keys()) {
            this.deaths.set(player, 0)
        }
    }

    public addPlayer(player: string) {
        this.scores.set(player, 0)
        this.kills.set(player, 0)
        this.deaths.set(player, 0)
    }

    public removePlayer(player: string) {
        this.scores.delete(player)
        this.kills.delete(player)
        this.deaths.delete(player)
    }

    public getTime(): number {
        return this.time
    }

    public setTime(time: number) {
        this.time = time
    }

    public addScore(player: string, score: number) {
        this.scores.set(player, this.getPlayerScore(player) + score)
    }

    public addKill(player: string) {
        this.kills.set(player, this.getPlayerKills(player) + 1)
    }

    public addDeath(player: string) {
        this.deaths.set(player, this.getPlayerDeaths(player) + 1)
    }

    public addFund(fund: number) {
        this.fund += fund
    }

    public getPlayerScore(player: string): number {
        return this.scores.get(player) || 0
    }

    public getPlayerKills(player: string): number {
        return this.kills.get(player) || 0
    }

    public getPlayerDeaths(player: string): number {
        return this.deaths.get(player) || 0
    }

    public sendPlayerStatistics(client: Player) {
        const setBattleUserStatusPacket = new SetBattleUserStatusPacket()
        setBattleUserStatusPacket.deaths = this.getPlayerDeaths(client.getUsername())
        setBattleUserStatusPacket.kills = this.getPlayerKills(client.getUsername())
        setBattleUserStatusPacket.score = this.getPlayerScore(client.getUsername())
        setBattleUserStatusPacket.user = client.getUsername()
        client.sendPacket(setBattleUserStatusPacket)
    }

    public sendBattleStatistics(client: Player) {
        const setBattleStatisticsCCPacket = new SetBattleStatisticsCCPacket();
        setBattleStatisticsCCPacket.mode = this.battle.getMode()
        setBattleStatisticsCCPacket.equipmentConstraintsMode = this.battle.getEquipmentConstraintsMode()
        setBattleStatisticsCCPacket.fund = this.fund
        setBattleStatisticsCCPacket.battleLimits = {
            scoreLimit: this.battle.getData().scoreLimit,
            timeLimitInSec: 0
        }
        setBattleStatisticsCCPacket.mapName = this.battle.getName();
        setBattleStatisticsCCPacket.maxPeopleCount = this.battle.getPlayersManager().getMaxPlayers()
        setBattleStatisticsCCPacket.parkourMode = this.battle.getData().parkourMode
        setBattleStatisticsCCPacket.int_1 = 100 // scoreLimit?
        setBattleStatisticsCCPacket.spectator = false
        setBattleStatisticsCCPacket.strings_1 = null
        setBattleStatisticsCCPacket.int_2 = 0

        client.sendPacket(setBattleStatisticsCCPacket);
    }
}