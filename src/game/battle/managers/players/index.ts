import { Battle } from "../..";
import { IUserTankResourcesData, SetUserTankResourcesDataPacket } from "../../../../network/packets/set-user-tank-resources-data";
import { Vector3d } from "../../../../utils/game/vector-3d";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";

export class BattlePlayersManager {

    private players: Map<string, Player> = new Map();
    private spectators: Map<string, Player> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public hasPlayer(username: string) {
        return this.players.has(username)
    }

    public getPlayers() {
        return Array.from(this.players.values())
    }

    public getPlayer(username: string) {
        return this.players.get(username)
    }

    public addPlayer(player: Player) {
        this.players.set(player.getUsername(), player)
        this.battle.getStatisticsManager().addPlayer(player.getUsername())
        player.setBattle(this.battle)
    }

    public removePlayer(username: string) {
        const player = this.players.get(username)
        if (player) {
            this.players.delete(username);
            this.battle.getStatisticsManager().removePlayer(username);
            player.setBattle(null)
        }
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
        for (const player of this.getPlayers()) {
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