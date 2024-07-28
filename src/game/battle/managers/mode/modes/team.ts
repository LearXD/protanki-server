import { IUser, SetTeamBattleUsersPropertiesPacket } from "@/network/packets/set-team-battle-users-properties";
import { BattleModeManager } from "..";
import { Team } from "@/states/team";
import { Player } from "@/game/player";
import { SetTeamBattleUserStatPacket } from "@/network/packets/set-team-battle-user-stat";

export abstract class BattleTeamModeManager extends BattleModeManager {

    public bluePoints: number = 0;
    public redPoints: number = 0;

    public broadcastUserStats(player: Player): void {
        const packet = new SetTeamBattleUserStatPacket();
        packet.user = {
            deaths: this.battle.getStatisticsManager().getPlayerDeaths(player.getUsername()),
            kills: this.battle.getStatisticsManager().getPlayerKills(player.getUsername()),
            score: this.battle.getStatisticsManager().getPlayerScore(player.getUsername()),
            name: player.getUsername()
        }
        packet.team = player.getTank().getTeam();
        this.battle.broadcastPacket(packet);
    }

    public sendUsersProperties(target: Player): void {

        const redUsers: IUser[] = [];
        const blueUsers: IUser[] = [];

        for (const player of this.battle.getPlayersManager().getPlayers()) {
            const userData: IUser = {
                chatModeratorLevel: player.getData().getModeratorLevel(),
                deaths: this.battle.getStatisticsManager().getPlayerDeaths(player.getUsername()),
                kills: this.battle.getStatisticsManager().getPlayerKills(player.getUsername()),
                rank: player.getData().getRank(),
                score: this.battle.getStatisticsManager().getPlayerScore(player.getUsername()),
                name: player.getUsername()
            }

            if (player.getTank().getTeam() === Team.BLUE) {
                blueUsers.push(userData);
            }

            if (player.getTank().getTeam() === Team.RED) {
                redUsers.push(userData);
            }
        }

        const packet = new SetTeamBattleUsersPropertiesPacket();
        packet.bluePoints = this.bluePoints;
        packet.redPoints = this.redPoints;
        packet.redUsers = redUsers;
        packet.blueUsers = blueUsers;
        target.sendPacket(packet);
    }


}