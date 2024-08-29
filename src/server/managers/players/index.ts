import { Player } from "@/game/player";
import { Server } from "@/server";
import { ServerError } from "@/server/utils/error";
import { LayoutState } from "@/states/layout-state";

export class PlayersManager {

    public players: Map<string, Player> = new Map()

    public constructor(
        private readonly server: Server
    ) { }

    public getPlayers() {
        return this.players;
    }

    public getPlayer(string: string) {
        return this.players.get(string);
    }

    public addPlayer(player: Player) {
        if (!player.getName()) {
            throw new ServerError('Player must have a username');
        }
        this.players.set(player.getName(), player);
    }

    public removePlayer(player: Player) {
        this.players.delete(player.getName());
    }

    public getPlayersOnState(state: LayoutState) {
        const payers = []
        for (const player of this.players.values()) {
            if (player.layoutState === state) {
                payers.push(player);
            }
        }
        return payers;
    }
}