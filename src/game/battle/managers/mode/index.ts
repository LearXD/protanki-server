import { Player } from "@/game/player";
import { Battle } from "../..";
import { SetBattleDataPacket } from "@/network/packets/set-battle-data";
import { SetBattleFundPacket } from "@/network/packets/set-battle-fund";
import { SetBattleRewardsPacket } from "@/network/packets/set-battle-rewards";
import { IMapSpawn } from "@/game/map/types";

export abstract class BattleModeManager {

    public fund: number = 0

    public constructor(
        protected readonly battle: Battle
    ) { }

    public init() {
        for (const player of this.battle.getPlayersManager().getPlayers()) {
            player.getTank().score = 0;
            player.getTank().kills = 0;
            player.getTank().deaths = 0;
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

    public getRandomSpawn(player: Player): IMapSpawn {
        return null
    }

    public sendFinishRewards() {
        const packet = new SetBattleRewardsPacket();
        packet.rewards = this.battle.getPlayersManager().getPlayers()
            .map(player => {
                return {
                    user: player.getUsername(),
                    score: player.getTank().score,
                    kills: player.getTank().kills,
                    deaths: player.getTank().deaths
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
        attacker.getTank().kills += 1;
        attacker.getTank().score += 10;
        this.broadcastUserStats(attacker);
    }

    public handleDeath(player: Player) {
        player.getTank().deaths += 1;
        this.broadcastUserStats(player);
    }

    public abstract sendLoadBattleMode(player: Player): void
    public abstract broadcastUserStats(player: Player): void

    public abstract broadcastAddUserProperties(player: Player): void
    public abstract sendUsersProperties(player: Player): void
}