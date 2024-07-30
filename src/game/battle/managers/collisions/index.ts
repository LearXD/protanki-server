import { Player } from "@/game/player";
import { Battle } from "../..";
import { BattleObject } from "./utils/object";
import { Logger } from "@/utils/logger";

export class BattleCollisionsManager {

    public objects: Map<string, BattleObject> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public addObject(object: BattleObject) {
        if (this.objects.has(object.getName())) {
            Logger.warn(`Object ${object.getName()} already exists in the battle ${this.battle.getBattleId()}`);
            return;
        }
        this.objects.set(object.getName(), object);
    }

    public removeObject(name: string) {
        if (!this.objects.has(name)) {
            Logger.warn(`Object ${name} not found in the battle ${this.battle.getBattleId()}`);
            return;
        }
        this.objects.delete(name);
    }

    public handlePlayerMovement(player: Player) {
        if (!player.getTank() || !player.getTank().isVisible()) {
            return;
        }
        const position = player.getTank().getPosition();
        for (const object of this.objects.values()) {
            if (object.isColliding(position)) {
                const collided = object.handleCollision(player);
                if (collided) {
                    this.objects.delete(object.getName());
                }
            }
        }
    }
}