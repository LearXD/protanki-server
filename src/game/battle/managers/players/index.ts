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

export class BattlePlayersManager {

    public readonly players: Map<string, Player> = new Map();
    private spectators: Map<string, Player> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public hasSpectator(player: Player) {
        return this.spectators.has(player.getUsername())
    }

    public hasPlayer(player: Player) {
        return this.players.has(player.getUsername())
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

    public addPlayer(player: Player) {
        this.players.set(player.getUsername(), player)

        if (this.battle.getMode() === BattleMode.DM) {
            const setAddUserOnBattleCounterPacket = new SetAddUserOnBattleCounterPacket();
            setAddUserOnBattleCounterPacket.battleId = this.battle.getBattleId();
            setAddUserOnBattleCounterPacket.userId = player.getUsername();
            player.server.battleManager.broadcastPacket(setAddUserOnBattleCounterPacket);

            const setAddUserInfoOnViewingBattlePacket = new SetAddUserInfoOnViewingBattlePacket
            setAddUserInfoOnViewingBattlePacket.battle = player.getUsername()
            setAddUserInfoOnViewingBattlePacket.kills = 0
            setAddUserInfoOnViewingBattlePacket.score = 0
            setAddUserInfoOnViewingBattlePacket.suspicious = false
            setAddUserInfoOnViewingBattlePacket.user = player.getUsername()
            this.battle.viewersManager.broadcastPacket(setAddUserInfoOnViewingBattlePacket);
        }

        if (this.battle.getMode() !== BattleMode.DM) {
            const setAddUserOnTeamBattleCounterPacket = new SetAddUserOnTeamBattleCounterPacket();
            setAddUserOnTeamBattleCounterPacket.battle = this.battle.getBattleId();
            setAddUserOnTeamBattleCounterPacket.team = player.getTank().getTeam();
            setAddUserOnTeamBattleCounterPacket.user = player.getUsername();
            player.server.battleManager.broadcastPacket(setAddUserOnTeamBattleCounterPacket);

            const setAddUserInfoOnViewingTeamBattlePacket = new SetAddUserInfoOnViewingTeamBattlePacket();
            setAddUserInfoOnViewingTeamBattlePacket.battleId = this.battle.getBattleId();
            setAddUserInfoOnViewingTeamBattlePacket.kills = 0;
            setAddUserInfoOnViewingTeamBattlePacket.score = 0;
            setAddUserInfoOnViewingTeamBattlePacket.suspicious = false;
            setAddUserInfoOnViewingTeamBattlePacket.user = player.getUsername();
            setAddUserInfoOnViewingTeamBattlePacket.team = player.getTank().getTeam();
            this.battle.viewersManager.broadcastPacket(setAddUserInfoOnViewingTeamBattlePacket);
        }

    }

    public removePlayer(player: Player) {
        this.players.delete(player.getUsername());

        if (this.battle.getMode() === BattleMode.DM) {
            const setRemoveUserFromBattleCounterPacket = new SetRemoveUserFromBattleCounterPacket();
            setRemoveUserFromBattleCounterPacket.battleId = this.battle.getBattleId();
            setRemoveUserFromBattleCounterPacket.userId = player.getUsername();
            player.server.battleManager.broadcastPacket(setRemoveUserFromBattleCounterPacket);
        }

        if (this.battle.getMode() !== BattleMode.DM) {
            const setRemoveUserFromTeamBattleCounterPacket = new SetRemoveUserFromTeamBattleCounterPacket()
            setRemoveUserFromTeamBattleCounterPacket.battleId = this.battle.getBattleId()
            setRemoveUserFromTeamBattleCounterPacket.userId = player.getUsername()
            player.server.battleManager.broadcastPacket(setRemoveUserFromTeamBattleCounterPacket)
        }

        const setRemoveUserFromViewingBattlePacket = new SetRemoveUserFromViewingBattlePacket();
        setRemoveUserFromViewingBattlePacket.battleId = player.getUsername();
        setRemoveUserFromViewingBattlePacket.userId = player.getUsername();
        this.battle.viewersManager.broadcastPacket(setRemoveUserFromViewingBattlePacket);
    }

    public addSpectator(player: Player) {
        this.spectators.set(player.getUsername(), player)
    }

    public removeSpectator(player: Player) {
        this.spectators.delete(player.getUsername());
    }

    public sendTanksData(player: Player) {
        for (const source of this.getPlayers()) {
            if (source.getUsername() !== player.getUsername()) {
                const data = source.getTank().getData()
                this.sendTankData({ ...data, state_null: false }, player)
            }
        }
    }

    public broadcastTankData(data: IUserTankResourcesData) {
        for (const player of this.getAll()) {
            if (player.getUsername() !== data.tank_id) {
                this.sendTankData({ ...data, state_null: false }, player)
            }
        }
    }

    public sendTankData(data: IUserTankResourcesData, player: Player) {
        const packet = new SetUserTankResourcesDataPacket();
        packet.data = data;
        player.sendPacket(packet);
    }
}