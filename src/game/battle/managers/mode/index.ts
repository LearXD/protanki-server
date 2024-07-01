import { Battle } from "../..";
import { Client } from "../../../client";

export abstract class BattleModeManager {
    public constructor(
        private readonly battle: Battle
    ) { }

    public getBattle() { return this.battle }

    public abstract sendPlayerStatistics(client: Client): void
}