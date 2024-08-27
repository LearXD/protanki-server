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

    public readonly points = new Map<TeamType, number>([[Team.RED, 0], [Team.BLUE, 0]]);

    public init() {
        this.points.set(Team.RED, 0);
        this.points.set(Team.BLUE, 0);

        super.init();
    }

    public addTeamScore(team: TeamType, increase: number): void {

        let score = this.points.get(team);
        this.points.set(team, score = score + increase);

        const setTeamScorePacket = new SetTeamScorePacket();
        setTeamScorePacket.team = team;
        setTeamScorePacket.score = score;
        this.battle.broadcastPacket(setTeamScorePacket)

        const setViewingBattleTeamScorePacket = new SetViewingBattleTeamScorePacket();
        setViewingBattleTeamScorePacket.battle = this.battle.getBattleId();
        setViewingBattleTeamScorePacket.team = team;
        setViewingBattleTeamScorePacket.score = score;
        this.battle.viewersManager.broadcastPacket(setViewingBattleTeamScorePacket)

        if (this.battle.getScoreLimit() > 0 && score >= this.battle.getScoreLimit()) {
            return this.battle.finish()
        }
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

        const users = new Map<TeamType, IUser[]>([[Team.RED, []], [Team.BLUE, []]]);

        for (const player of this.battle.playersManager.getPlayers()) {
            users.get(player.tank.team)
                .push({
                    chatModeratorLevel: player.data.moderatorLevel,
                    deaths: player.tank.deaths,
                    kills: player.tank.kills,
                    rank: player.data.getRank(),
                    score: player.tank.score,
                    name: player.getUsername()
                });
        }

        const packet = new SetTeamBattleUsersPropertiesPacket();
        packet.bluePoints = this.points.get(Team.BLUE);
        packet.redPoints = this.points.get(Team.RED);
        packet.redUsers = users.get(Team.RED);
        packet.blueUsers = users.get(Team.BLUE);
        target.sendPacket(packet);
    }


}