import { Battle } from "../..";
import { SetBattleAddUserPropertiesPacket } from "../../../../network/packets/set-battle-chat-config";
import { SetBattleFundPacket } from "../../../../network/packets/set-battle-fund";
import { SetBattleRewardsPacket } from "../../../../network/packets/set-battle-rewards";
import { SetBattleDataPacket } from "../../../../network/packets/set-battle-data";
import { Player } from "../../../player";
import { SetBattleUsersPropertiesPacket } from "../../../../network/packets/set-battle-users-properties";

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

    public addPlayer(player: Player) {
        this.scores.set(player.getUsername(), 0)
        this.kills.set(player.getUsername(), 0)
        this.deaths.set(player.getUsername(), 0)
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

    public addScore(player: Player, score: number) {
        this.scores.set(player.getUsername(), this.getPlayerScore(player.getUsername()) + score)
        this.battle.getModeManager().broadcastUserStats(player)
    }

    public increaseKill(player: Player) {
        this.kills.set(player.getUsername(), this.getPlayerKills(player.getUsername()) + 1)
        this.battle.getModeManager().broadcastUserStats(player)
    }

    public increaseDeath(player: Player) {
        this.deaths.set(player.getUsername(), this.getPlayerDeaths(player.getUsername()) + 1)
        this.battle.getModeManager().broadcastUserStats(player)
    }

    public getFund(): number {
        return this.fund
    }

    public addFund(fund: number) {
        this.fund += fund
    }

    public sendFund() {
        const packet = new SetBattleFundPacket();
        packet.fund = this.getFund();
        this.battle.broadcastPacket(packet);
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

    public sendFinishRewards() {
        const packet = new SetBattleRewardsPacket();
        packet.rewards = this.battle.getPlayersManager().getPlayers()
            .map(player => {
                const username = player.getUsername()
                return {
                    user: username,
                    score: this.getPlayerScore(username),
                    kills: this.getPlayerKills(username),
                    deaths: this.getPlayerDeaths(username)
                }
            })
        packet.timeToRestart = 10;
        this.battle.broadcastPacket(packet);
    }

    public sendBattleData(client: Player, spectator: boolean = false) {
        const packet = new SetBattleDataPacket();
        packet.mode = this.battle.getMode()
        packet.equipmentConstraintsMode = this.battle.getEquipmentConstraintsMode()
        packet.fund = this.getFund()
        packet.battleLimits = {
            scoreLimit: this.battle.getScoreLimit(),
            timeLimitInSec: this.battle.getTimeLimitInSec()
        }
        packet.mapName = this.battle.getName();
        packet.maxPeopleCount = this.battle.getMaxPeopleCount()
        packet.parkourMode = this.battle.isParkourMode();
        packet.premiumBonusInPercent = 0
        packet.spectator = spectator
        packet.suspiciousUsers = ["TheUnknown"]
        packet.timeLeft = this.battle.getTimeLeft()
        client.sendPacket(packet);
    }

    public sendUserProperties(player: Player) {
        const statistics = this.battle.getStatisticsManager()

        const packet = new SetBattleUsersPropertiesPacket();
        packet.users = this.battle.getPlayersManager()
            .getPlayers().map((player) => {
                return {
                    chatModeratorLevel: player.getData().getModeratorLevel(),
                    deaths: statistics.getPlayerDeaths(player.getUsername()),
                    kills: statistics.getPlayerKills(player.getUsername()),
                    rank: player.getData().getRank(),
                    score: statistics.getPlayerScore(player.getUsername()),
                    name: player.getUsername()
                }
            })

        player.sendPacket(packet);
    }

    public sendAddUserProperties(player: Player) {
        const packet = new SetBattleAddUserPropertiesPacket();
        packet.userId = player.getUsername();
        packet.users = this.battle.getPlayersManager().getPlayers()
            .map(player => {
                return {
                    chatModeratorLevel: player.getData().getModeratorLevel(),
                    deaths: this.getPlayerDeaths(player.getUsername()),
                    kills: this.getPlayerKills(player.getUsername()),
                    rank: player.getData().getRank(),
                    score: this.getPlayerScore(player.getUsername()),
                    name: player.getUsername()
                }
            })

        this.battle.broadcastPacket(packet, [player.getUsername()]);
    }
}