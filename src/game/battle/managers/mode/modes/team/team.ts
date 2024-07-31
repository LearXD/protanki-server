import { IUser, SetTeamBattleUsersPropertiesPacket } from "@/network/packets/set-team-battle-users-properties";
import { BattleModeManager } from "../..";
import { Team, TeamType } from "@/states/team";
import { Player } from "@/game/player";
import { SetTeamBattleUserStatPacket } from "@/network/packets/set-team-battle-user-stat";
import { SetTeamBattleAddUsersPropertiesPacket } from "@/network/packets/set-team-battle-add-users-properties";
import { SetTeamScorePacket } from "@/network/packets/set-team-score";
import { SetUserLeftBattlePacket } from "@/network/packets/set-user-left-battle";

export abstract class BattleTeamModeManager extends BattleModeManager {

    public bluePoints: number = 0;
    public redPoints: number = 0;

    public init() {
        this.bluePoints = 0;
        this.redPoints = 0;
    }

    public getTeamScore(team: TeamType): number {
        switch (team) {
            case Team.RED: return this.redPoints;
            case Team.BLUE: return this.bluePoints;
        }
    }

    public addTeamScore(team: TeamType, increase: number): void {

        switch (team) {
            case Team.RED: this.redPoints += increase; break
            case Team.BLUE: this.bluePoints += increase; break
        }

        const score = team === Team.RED ? this.redPoints : this.bluePoints;

        const packet = new SetTeamScorePacket();
        packet.team = team;
        packet.score = score;

        this.battle.broadcastPacket(packet)
    }

    public broadcastAddUserProperties(player: Player): void {
        const players = this.battle.getPlayersManager().getPlayers()
            .filter(p => player.getTank().getTeam() === p.getTank().getTeam());

        const packet = new SetTeamBattleAddUsersPropertiesPacket();
        packet.userId = player.getUsername();
        packet.usersInfo = players.map(p => (
            {
                chatModeratorLevel: p.getData().getModeratorLevel(),
                deaths: p.getTank().getDeaths(),
                kills: p.getTank().getKills(),
                rank: p.getData().getRank(),
                score: p.getTank().getScore(),
                name: p.getUsername()
            }
        ))
        packet.team = player.getTank().getTeam();

        this.battle.broadcastPacket(packet, [player.getUsername()]);
    }

    public broadcastRemovePlayer(player: Player): void {
        const packet = new SetUserLeftBattlePacket();
        packet.userId = player.getUsername();
        this.battle.broadcastPacket(packet);
    }

    public broadcastUserStats(player: Player): void {
        const packet = new SetTeamBattleUserStatPacket();
        packet.user = {
            deaths: player.getTank().getDeaths(),
            kills: player.getTank().getKills(),
            score: player.getTank().getScore(),
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
                deaths: player.getTank().getDeaths(),
                kills: player.getTank().getKills(),
                rank: player.getData().getRank(),
                score: player.getTank().getScore(),
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