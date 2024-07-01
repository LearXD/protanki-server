import { Battle } from "../..";
import { Client } from "../../../client";

export enum BattleTeam {
    RED = "red",
    BLUE = "blue"
}

export class BattleTeamsManager {

    private red: Map<string, Client> = new Map();
    private blue: Map<string, Client> = new Map();

    constructor(
        private readonly battle: Battle
    ) { }

    private score = { red: 0, blue: 0 }

    public addPlayer(client: Client, team: BattleTeam) {
        if (team === BattleTeam.RED) {
            this.red.set(client.getUsername(), client);
            return true;
        }

        if (team === BattleTeam.BLUE) {
            this.blue.set(client.getUsername(), client);
            return true;
        }

        return false;
    }

    public removePlayer(username: string) {
        if (this.red.has(username)) {
            this.red.delete(username);
            return true;
        }

        if (this.blue.has(username)) {
            this.blue.delete(username);
            return true;
        }

        return false;
    }

    public getTeamScore(team: BattleTeam) {
        return this.score[team];
    }

}