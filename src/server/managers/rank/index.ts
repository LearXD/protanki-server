import { Server } from "@/server";
import { IRanksData } from "./types";
import { Rank, RankType } from "@/states/rank";
import { Player } from "@/game/player";
import { SetUserNewRankPacket } from "@/network/packets/set-user-new-rank";
import { SetUserRankPacket } from "@/network/packets/set-user-rank";
import { SetUserRankUpDialogPacket } from "@/network/packets/set-user-rank-up-dialog";
import { Logger } from "@/utils/logger";

export class RankManager {

    public static ranks: IRanksData[] = [];

    public constructor(
        private readonly server: Server
    ) {
        RankManager.ranks = this.server.assetsManager.getData('ranks.json');
    }

    public static getRank(rank: RankType): IRanksData {
        return this.ranks.find(r => r.rank === rank);
    }

    public static getRankByExperience(experience: number): RankType {
        const rank = this.ranks.filter(rank => rank.experience <= experience).pop();

        if (!rank) {
            return Rank.RECRUIT;
        }

        return rank.rank;
    }

    public static getNextRankScore(experience: number): number {
        const rank = this.ranks.find(rank => rank.experience > experience)

        if (!rank) {
            return 0;
        }

        return rank.experience;
    }

    public handlePlayerRankChange(player: Player) {
        const rank = RankManager.getRank(player.data.getRank());

        const setUserRankUpDialogPacket = new SetUserRankUpDialogPacket();
        setUserRankUpDialogPacket.rank = rank.rank;
        setUserRankUpDialogPacket.score = player.data.experience;
        setUserRankUpDialogPacket.currentRankScore = rank.experience;
        setUserRankUpDialogPacket.nextRankScore = RankManager.getNextRankScore(player.data.experience);
        setUserRankUpDialogPacket.bonusCrystals = rank.bonus;
        player.sendPacket(setUserRankUpDialogPacket);

        player.data.increaseCrystals(rank.bonus, false);

        const battle = player.getBattle();
        if (battle) {
            const setUserNewRankPacket = new SetUserNewRankPacket();
            setUserNewRankPacket.userId = player.getUsername()
            setUserNewRankPacket.newRank = player.data.getRank()
            battle.broadcastPacket(setUserNewRankPacket);

            const setUserRankPacket = new SetUserRankPacket();
            setUserRankPacket.user = player.getUsername();
            setUserRankPacket.rank = rank.rank;
            player.sendPacket(setUserRankPacket);
        }
    }
}