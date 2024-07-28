import { Player } from "@/game/player";
import { Battle } from "../..";

export abstract class BattleModeManager {
    public constructor(
        protected readonly battle: Battle
    ) { }

    public abstract sendLoadBattleMode(player: Player): void

    public abstract broadcastUserStats(player: Player): void;

    public abstract sendUsersProperties(player: Player): void
}