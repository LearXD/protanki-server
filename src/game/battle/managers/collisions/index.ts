import { Player } from "@/game/player";
import { Battle } from "../..";
import { BattleObject } from "./utils/object";
import { Logger } from "@/utils/logger";
import { Vector3d } from "@/utils/vector-3d";

export class BattleCollisionsManager {

    public objects: Map<string, BattleObject> = new Map()

    public constructor(
        private readonly battle: Battle
    ) { }

    public addObject(object: BattleObject) {
        this.objects.set(object.getName(), object);
    }

    public removeObject(name: string) {
        if (!this.objects.has(name)) {
            Logger.warn(`Object ${name} not found in the battle ${this.battle.getBattleId()}`);
            return;
        }
        this.objects.delete(name);
    }

    public checkObjectCollisions(player: Player, position?: Vector3d) {

        if (!player.tank || !player.tank.isVisible()) {
            return;
        }

        if (!position) {
            position = player.tank.getPosition();
        }

        for (const object of this.objects.values()) {
            if (object.isColliding(position)) {
                const collided = object.handleCollision(player);
                if (collided) {
                    this.objects.delete(object.getName());
                }
            }
        }
    }

    public handlePlayerMovement(player: Player) {
        this.battle.map.areaManager.checkCollisions(player)
        this.checkObjectCollisions(player)
    }
}