import { BattleModeManager } from "..";
import { SetBattleStatisticsDMCCPacket } from "../../../../../network/packets/set-battle-statistics-dm-cc";
import { ChatModeratorLevel } from "../../../../../utils/game/chat-moderator-level";
import { Player } from "../../../../player";

export class BattleDeathMatchModeManager extends BattleModeManager {

    public sendPlayerStatistics(player: Player): void {
        const statistics = this.getBattle().getStatisticsManager()

        const setBattleStatisticsDMCCPacket = new SetBattleStatisticsDMCCPacket();
        setBattleStatisticsDMCCPacket.users = this.getBattle().getPlayersManager()
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
        player.sendPacket(setBattleStatisticsDMCCPacket);
    }

}