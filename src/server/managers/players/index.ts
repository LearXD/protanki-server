import { Player } from "@/game/player";
import { Server } from "@/server";

export class PlayersManager {

    public players: Map<string, Player> = new Map();

    public constructor(
        private readonly server: Server
    ) { }

    private resolvePlayerName(player: Player | string) {
        return typeof player === 'string' ? player : player.getIdentifier();
    }

    public hasPlayer(player: Player | string) {
        return this.players.has(this.resolvePlayerName(player));
    }

    public getPlayer(string: string) {
        return this.players.get(string);
    }

    public getPlayers() {
        return this.players;
    }

    public addPlayer(player: Player) {
        if (!player.getUsername()) {
            throw new Error('Player must have a username');
        }
        this.players.set(player.getUsername(), player);
    }

    public removePlayer(player: Player | string) {
        this.players.delete(this.resolvePlayerName(player));
    }
}