import { Player } from "@/game/player";
import { Battle } from "../..";
import { BattleObject } from "./utils/object";
import { Logger } from "@/utils/logger";
import { MapAreaAction } from "@/game/map/types";
import { Vector3d } from "@/utils/vector-3d";

export class BattleCollisionsManager {

    public objects: Map<string, BattleObject> = new Map();

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

    public checkAreaCollisions(player: Player, position?: Vector3d) {

        if (!player.tank || !player.tank.isAlive()) {
            return;
        }

        if (!position) {
            position = player.tank.getPosition();
        }

        for (const area of this.battle.getMap().getAreas()) {
            const { minX, minY: minZ, minZ: minY, maxX, maxY: maxZ, maxZ: maxY } = area // SWAP Y AND Z
            if (
                (position.x > minX && position.x < maxX) &&
                (position.y > minY && position.y < maxY) &&
                (position.z > minZ && position.z < maxZ)
            ) {

                if (area.action === MapAreaAction.KILL) {
                    player.tank.suicide();
                }

                if (area.action === MapAreaAction.KICK) {
                    player.close()
                }
            }
        }
    }

    public handlePlayerMovement(player: Player) {
        this.checkAreaCollisions(player)
        this.checkObjectCollisions(player)
    }
}