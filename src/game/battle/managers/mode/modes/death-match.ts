import { BattleModeManager } from "..";
import { SetBattleStatisticsDMCCPacket } from "../../../../../network/packets/set-battle-statistics-dm-cc";
import { ChatModeratorLevel } from "../../../../../utils/game/chat-moderator-level";
import { Player } from "../../../../player";

export class BattleDeathMatchModeManager extends BattleModeManager {

    public sendPlayerStatistics(client: Player): void {
        const setBattleStatisticsDMCCPacket = new SetBattleStatisticsDMCCPacket();
        setBattleStatisticsDMCCPacket.users = this.getBattle().getPlayersManager()
            .getPlayers().map((player) => {
                const statistics = this.getBattle().getStatisticsManager()
                return {
                    chatModeratorLevel: ChatModeratorLevel.NONE,
                    deaths: statistics.getPlayerDeaths(player.getUsername()),
                    kills: statistics.getPlayerKills(player.getUsername()),
                    rank: 30,
                    score: statistics.getPlayerScore(player.getUsername()),
                    name: player.getUsername()
                }
            })
        client.sendPacket(setBattleStatisticsDMCCPacket);
    }

}