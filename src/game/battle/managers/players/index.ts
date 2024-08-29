import { Battle } from "../..";
import { IUserTankResourcesData, SetUserTankResourcesDataPacket } from "../../../../network/packets/set-user-tank-resources-data";
import { Player } from "../../../player";
import { SetAddUserOnBattleCounterPacket } from "@/network/packets/set-add-user-on-battle-counter";
import { SetRemoveUserFromBattleCounterPacket } from "@/network/packets/set-remove-user-from-battle-counter";
import { BattleMode } from "@/states/battle-mode";
import { SetAddUserInfoOnViewingBattlePacket } from "@/network/packets/set-add-user-info-on-viewing-battle";
import { SetRemoveUserFromViewingBattlePacket } from "@/network/packets/set-remove-user-from-viewing-battle";
import { SetAddUserOnTeamBattleCounterPacket } from "@/network/packets/set-add-user-on-team-battle-counter";
import { SetRemoveUserFromTeamBattleCounterPacket } from "@/network/packets/set-remove-user-from-team-battle-counter";
import { SetAddUserInfoOnViewingTeamBattlePacket } from "@/network/packets/set-add-user-info-on-viewing-team-battle";
import { Team, TeamType } from "@/states/team";
import { Tank } from "@/game/tank";

export class BattlePlayersManager {

    public readonly players: Map<string, Player> = new Map()
    private spectators: Map<string, Player> = new Map()

    public constructor(
        private readonly battle: Battle
    ) { }

    public hasSpectator(player: Player) {
        return this.spectators.has(player.getName())
    }

    public hasPlayer(player: Player) {
        return this.players.has(player.getName())
    }

    public getSpectators() {
        return Array.from(this.spectators.values())
    }

    public getPlayers() {
        return Array.from(this.players.values())
    }

    public getAll() {
        return this.getPlayers()
            .concat(this.getSpectators())
    }

    public getPlayer(username: string) {
        return this.players.get(username)
    }

    public addPlayer(player: Player, team: TeamType = Team.NONE) {

        player.battle = this.battle

        if (team === Team.SPECTATOR) {
            this.addSpectator(player)
            return
        }

        player.tank = new Tank(player, this.battle, team)
        this.players.set(player.getName(), player)

        if (this.battle.getMode() === BattleMode.DM) {
            const setAddUserOnBattleCounterPacket = new SetAddUserOnBattleCounterPacket();
            setAddUserOnBattleCounterPacket.battleId = this.battle.battleId;
            setAddUserOnBattleCounterPacket.userId = player.getName();
            player.server.battles.broadcastPacket(setAddUserOnBattleCounterPacket);

            const setAddUserInfoOnViewingBattlePacket = new SetAddUserInfoOnViewingBattlePacket
            setAddUserInfoOnViewingBattlePacket.battle = player.getName()
            setAddUserInfoOnViewingBattlePacket.kills = 0
            setAddUserInfoOnViewingBattlePacket.score = 0
            setAddUserInfoOnViewingBattlePacket.suspicious = false
            setAddUserInfoOnViewingBattlePacket.user = player.getName()
            this.battle.viewersManager.broadcastPacket(setAddUserInfoOnViewingBattlePacket);
        }

        if (this.battle.getMode() !== BattleMode.DM) {
            const setAddUserOnTeamBattleCounterPacket = new SetAddUserOnTeamBattleCounterPacket();
            setAddUserOnTeamBattleCounterPacket.battle = this.battle.battleId;
            setAddUserOnTeamBattleCounterPacket.team = player.tank.team;
            setAddUserOnTeamBattleCounterPacket.user = player.getName();
            player.server.battles.broadcastPacket(setAddUserOnTeamBattleCounterPacket);

            const setAddUserInfoOnViewingTeamBattlePacket = new SetAddUserInfoOnViewingTeamBattlePacket();
            setAddUserInfoOnViewingTeamBattlePacket.battleId = this.battle.battleId;
            setAddUserInfoOnViewingTeamBattlePacket.kills = 0;
            setAddUserInfoOnViewingTeamBattlePacket.score = 0;
            setAddUserInfoOnViewingTeamBattlePacket.suspicious = false;
            setAddUserInfoOnViewingTeamBattlePacket.user = player.getName();
            setAddUserInfoOnViewingTeamBattlePacket.team = player.tank.team;
            this.battle.viewersManager.broadcastPacket(setAddUserInfoOnViewingTeamBattlePacket);
        }

    }

    public removePlayer(player: Player) {

        if (this.hasSpectator(player)) {
            this.removeSpectator(player)
            return
        }

        this.players.delete(player.getName());

        if (this.battle.getMode() === BattleMode.DM) {
            const setRemoveUserFromBattleCounterPacket = new SetRemoveUserFromBattleCounterPacket();
            setRemoveUserFromBattleCounterPacket.battleId = this.battle.battleId;
            setRemoveUserFromBattleCounterPacket.userId = player.getName();
            player.server.battles.broadcastPacket(setRemoveUserFromBattleCounterPacket);
        }

        if (this.battle.getMode() !== BattleMode.DM) {
            const setRemoveUserFromTeamBattleCounterPacket = new SetRemoveUserFromTeamBattleCounterPacket()
            setRemoveUserFromTeamBattleCounterPacket.battleId = this.battle.battleId
            setRemoveUserFromTeamBattleCounterPacket.userId = player.getName()
            player.server.battles.broadcastPacket(setRemoveUserFromTeamBattleCounterPacket)
        }

        const setRemoveUserFromViewingBattlePacket = new SetRemoveUserFromViewingBattlePacket();
        setRemoveUserFromViewingBattlePacket.battleId = player.getName();
        setRemoveUserFromViewingBattlePacket.userId = player.getName();
        this.battle.viewersManager.broadcastPacket(setRemoveUserFromViewingBattlePacket);
    }

    public addSpectator(player: Player) {
        this.spectators.set(player.getName(), player)
    }

    public removeSpectator(player: Player) {
        this.spectators.delete(player.getName());
    }

    public sendTanksData(player: Player) {
        for (const source of this.getPlayers()) {
            if (source.getName() !== player.getName()) {
                const data = source.tank.getData()
                this.sendTankData({ ...data, state_null: false }, player)
            }
        }
    }

    // TODO: check tank id to send state_null
    public broadcastTankData(data: Exclude<IUserTankResourcesData, 'state_null'>) {
        for (const player of this.getAll()) {
            this.sendTankData(
                { ...data, state_null: player.getName() === data.tank_id }, player
            )
        }
    }

    private sendTankData(data: IUserTankResourcesData, player: Player) {
        const packet = new SetUserTankResourcesDataPacket();
        packet.data = data;
        player.sendPacket(packet);
    }
}