import { Battle } from "../..";

export abstract class BattleModeManager {
    public constructor(
        private readonly battle: Battle
    ) { }

    public getBattle() { return this.battle }

    public abstract sendUserProperties(): void
}