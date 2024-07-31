import { Player } from "@/game/player";
import { Server } from "@/server";
import { ServerError } from "@/server/utils/error";
import { LayoutState } from "@/states/layout-state";

export class PlayersManager {

    public players: Map<string, Player> = new Map();

    public constructor(
        private readonly server: Server
    ) { }

    public getPlayers() {
        return this.players;
    }

    private resolvePlayerName(player: Player | string) {
        return typeof player === 'string' ? player : player.getIdentifier();
    }

    public hasPlayer(player: Player | string) {
        return this.players.has(this.resolvePlayerName(player));
    }

    public getPlayer(string: string) {
        return this.players.get(string);
    }

    public addPlayer(player: Player) {
        if (!player.getUsername()) {
            throw new ServerError('Player must have a username');
        }
        this.players.set(player.getUsername(), player);
    }

    public removePlayer(player: Player | string) {
        this.players.delete(this.resolvePlayerName(player));
    }

    public getPlayersOnState(state: LayoutState) {
        const payers = []
        for (const player of this.players.values()) {
            if (player.getLayoutState() === state) {
                payers.push(player);
            }
        }
        return payers;
    }
}