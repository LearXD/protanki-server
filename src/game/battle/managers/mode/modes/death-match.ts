import { BattleModeManager } from "..";
import { SetBattleStatisticsDMCCPacket } from "../../../../../network/packets/set-battle-statistics-dm-cc";
import { ChatModeratorLevel } from "../../../../../utils/game/chat-moderator-level";
import { ByteArray } from "../../../../../utils/network/byte-array";
import { Client } from "../../../../client";

export class BattleDeathMatchModeManager extends BattleModeManager {

    public sendPlayerStatistics(client: Client): void {
        const setBattleStatisticsDMCCPacket = new SetBattleStatisticsDMCCPacket(new ByteArray());
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