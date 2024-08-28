import { Player } from "@/game/player";
import { Battle } from "../..";
import { SetBattleDataPacket } from "@/network/packets/set-battle-data";
import { SetBattleFundPacket } from "@/network/packets/set-battle-fund";
import { SetBattleRewardsPacket } from "@/network/packets/set-battle-rewards";
import { IMapSpawn } from "@/game/map/types";

export abstract class BattleModeManager {

    public fund: number = 0

    public constructor(
        public readonly battle: Battle
    ) { }

    public abstract getRandomSpawn(player: Player): IMapSpawn

    public abstract sendLoadBattleMode(player: Player): void

    public abstract broadcastUserStats(player: Player): void
    public abstract sendUsersProperties(player: Player): void

    public abstract onPlayerJoin(player: Player): void
    public abstract onPlayerLeave(player: Player): void

    public init() {
        for (const player of this.battle.playersManager.getPlayers()) {
            player.tank.score = 0;
            player.tank.kills = 0;
            player.tank.deaths = 0;
        }
    }

    public sendBattleData(client: Player, spectator: boolean = false) {
        const packet = new SetBattleDataPacket();

        packet.mode = this.battle.getMode()
        packet.equipmentConstraintsMode = this.battle.getEquipmentConstraintsMode()
        packet.fund = this.fund
        packet.battleLimits = {
            scoreLimit: this.battle.getScoreLimit(),
            timeLimitInSec: this.battle.getTimeLimitInSec()
        }
        packet.mapName = this.battle.getName();
        packet.maxPeopleCount = this.battle.getMaxPeopleCount()
        packet.parkourMode = this.battle.isParkourMode();
        packet.premiumBonusInPercent = 0
        packet.spectator = spectator
        packet.suspiciousUsers = []
        packet.timeLeft = this.battle.getTimeLeft()

        client.sendPacket(packet);
    }

    public sendFinishRewards() {
        const packet = new SetBattleRewardsPacket();
        packet.rewards = this.battle.playersManager.getPlayers()
            .map(player => {
                return {
                    user: player.getUsername(),
                    score: player.tank.score,
                    kills: player.tank.kills,
                    deaths: player.tank.deaths
                }
            })
        packet.timeToRestart = 10;
        this.battle.broadcastPacket(packet);
    }

    public sendFund() {
        const packet = new SetBattleFundPacket();
        packet.fund = this.fund;
        this.battle.broadcastPacket(packet);
    }

    public handleKill(attacker: Player, target: Player) {
        attacker.tank.setKills(attacker.tank.kills + 1);
        attacker.tank.setScore(attacker.tank.score + 100);
        this.broadcastUserStats(attacker);
    }

    public handleDeath(player: Player) {
        player.tank.deaths += 1;
        this.broadcastUserStats(player);
    }
}