import { Player } from "@/game/player";
import { BattleModeManager } from "..";
import { SetBattleUsersPropertiesPacket } from "../../../../../network/packets/set-battle-users-properties";
import { SetBattleUserStatusPacket } from "@/network/packets/set-battle-user-status";
import { SetLoadDeathMatchPacket } from "@/network/packets/set-load-death-match";

export class BattleDeathMatchModeManager extends BattleModeManager {

    public sendLoadBattleMode(player: Player): void {
        player.sendPacket(new SetLoadDeathMatchPacket())
    }

    public broadcastUserStats(player: Player): void {
        const statistics = this.battle.getStatisticsManager()

        const setBattleUserStatusPacket = new SetBattleUserStatusPacket()
        setBattleUserStatusPacket.deaths = statistics.getPlayerDeaths(player.getUsername())
        setBattleUserStatusPacket.kills = statistics.getPlayerKills(player.getUsername())
        setBattleUserStatusPacket.score = statistics.getPlayerScore(player.getUsername())
        setBattleUserStatusPacket.user = player.getUsername()

        this.battle.broadcastPacket(setBattleUserStatusPacket)
    }

    public sendUsersProperties(player: Player): void {
        const statistics = this.battle.getStatisticsManager()

        const packet = new SetBattleUsersPropertiesPacket();
        packet.users = this.battle.getPlayersManager().getPlayers()
            .map((playing) => ({
                chatModeratorLevel: playing.getData().getModeratorLevel(),
                deaths: statistics.getPlayerDeaths(playing.getUsername()),
                kills: statistics.getPlayerKills(playing.getUsername()),
                rank: playing.getData().getRank(),
                score: statistics.getPlayerScore(playing.getUsername()),
                name: playing.getUsername()
            }))

        player.sendPacket(packet);
    }

}