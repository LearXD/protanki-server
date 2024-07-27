import { Battle } from "../..";
import { IUserTankResourcesData, SetUserTankResourcesDataPacket } from "../../../../network/packets/set-user-tank-resources-data";
import { Vector3d } from "../../../../utils/vector-3d";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";

export class BattlePlayersManager {

    private players: Map<string, Player> = new Map();
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
    }

    public addSpectator(player: Player) {
        this.spectators.set(player.getUsername(), player)
    }

    public removePlayer(player: Player) {
        this.players.delete(player.getUsername());
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