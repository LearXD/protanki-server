import { Battle } from "../..";
import { SetBattleAddUserPropertiesPacket } from "../../../../network/packets/set-battle-chat-config";
import { SetBattleFundPacket } from "../../../../network/packets/set-battle-fund";
import { SetBattleRewardsPacket } from "../../../../network/packets/set-battle-rewards";
import { SetBattleDataPacket } from "../../../../network/packets/set-battle-data";
import { SetBattleUserStatusPacket } from "../../../../network/packets/set-battle-user-status";
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

    public addScore(player: string, score: number) {
        this.scores.set(player, this.getPlayerScore(player) + score)
    }

    public addKill(player: string) {
        this.kills.set(player, this.getPlayerKills(player) + 1)
    }

    public addDeath(player: string) {
        this.deaths.set(player, this.getPlayerDeaths(player) + 1)
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

    public broadcastPlayerStatistics(client: Player) {
        const setBattleUserStatusPacket = new SetBattleUserStatusPacket()
        setBattleUserStatusPacket.deaths = this.getPlayerDeaths(client.getUsername())
        setBattleUserStatusPacket.kills = this.getPlayerKills(client.getUsername())
        setBattleUserStatusPacket.score = this.getPlayerScore(client.getUsername())
        setBattleUserStatusPacket.user = client.getUsername()
        this.battle.broadcastPacket(setBattleUserStatusPacket)
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
        packet.scoreLimit = 100 // scoreLimit?
        packet.spectator = spectator
        packet.strings_1 = []
        packet.lastTime = this.battle.getTimeLeft()
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