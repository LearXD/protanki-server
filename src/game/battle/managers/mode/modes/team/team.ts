import { IUser, SetTeamBattleUsersPropertiesPacket } from "@/network/packets/set-team-battle-users-properties";
import { BattleModeManager } from "../..";
import { Team, TeamType } from "@/states/team";
import { Player } from "@/game/player";
import { SetTeamBattleUserStatPacket } from "@/network/packets/set-team-battle-user-stat";
import { SetTeamBattleAddUsersPropertiesPacket } from "@/network/packets/set-team-battle-add-users-properties";
import { SetTeamScorePacket } from "@/network/packets/set-team-score";
import { SetUserLeftBattlePacket } from "@/network/packets/set-user-left-battle";
import { SetViewingBattleTeamScorePacket } from "@/network/packets/set-viewing-battle-team-score";

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

        const setTeamScorePacket = new SetTeamScorePacket();
        setTeamScorePacket.team = team;
        setTeamScorePacket.score = score;
        this.battle.broadcastPacket(setTeamScorePacket)

        const setViewingBattleTeamScorePacket = new SetViewingBattleTeamScorePacket();
        setViewingBattleTeamScorePacket.battle = this.battle.getBattleId();
        setViewingBattleTeamScorePacket.team = team;
        setViewingBattleTeamScorePacket.score = score;
        this.battle.viewersManager.broadcastPacket(setViewingBattleTeamScorePacket)
    }

    public broadcastAddUserProperties(player: Player): void {
        const players = this.battle.playersManager.getPlayers()
            .filter(p => player.tank.team === p.tank.team);

        const packet = new SetTeamBattleAddUsersPropertiesPacket();
        packet.userId = player.getUsername();
        packet.usersInfo = players.map(p => (
            {
                chatModeratorLevel: p.data.moderatorLevel,
                deaths: p.tank.deaths,
                kills: p.tank.kills,
                rank: p.data.getRank(),
                score: p.tank.score,
                name: p.getUsername()
            }
        ))
        packet.team = player.tank.team;

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
            deaths: player.tank.deaths,
            kills: player.tank.kills,
            score: player.tank.score,
            name: player.getUsername()
        }
        packet.team = player.tank.team;
        this.battle.broadcastPacket(packet);
    }

    public sendUsersProperties(target: Player): void {

        const redUsers: IUser[] = [];
        const blueUsers: IUser[] = [];

        for (const player of this.battle.playersManager.getPlayers()) {
            const userData: IUser = {
                chatModeratorLevel: player.data.moderatorLevel,
                deaths: player.tank.deaths,
                kills: player.tank.kills,
                rank: player.data.getRank(),
                score: player.tank.score,
                name: player.getUsername()
            }

            if (player.tank.team === Team.BLUE) {
                blueUsers.push(userData);
            }

            if (player.tank.team === Team.RED) {
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