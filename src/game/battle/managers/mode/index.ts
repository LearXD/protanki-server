import { Battle } from "../..";
import { Player } from "../../../player";

export abstract class BattleModeManager {
    public constructor(
        private readonly battle: Battle
    ) { }

    public getBattle() { return this.battle }

    public abstract sendPlayerStatistics(client: Player): void
}