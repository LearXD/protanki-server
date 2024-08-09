import { Player } from "@/game/player";
import { Battle } from "../..";
import { BattleObject } from "./utils/object";
import { Logger } from "@/utils/logger";
import { MapAreaAction } from "@/game/map/types";

export class BattleCollisionsManager {

    public objects: Map<string, BattleObject> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public addObject(object: BattleObject) {
        // if (this.objects.has(object.getName())) {
        //     Logger.warn(`Object ${object.getName()} already exists in the battle ${this.battle.getBattleId()}`);
        // }
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

        if (!player.tank || !player.tank.isVisible()) {
            return;
        }

        const position = player.tank.getPosition();

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
            }
        }

        for (const object of this.objects.values()) {
            // Logger.debug()
            // Logger.debug(object.name)
            // Logger.debug(object.position.toString())
            // Logger.debug(position.toString())
            // Logger.debug(position.distanceTo(object.position))
            // Logger.debug()
            if (object.isColliding(position)) {
                const collided = object.handleCollision(player);
                if (collided) {
                    this.objects.delete(object.getName());
                }
            }
        }
    }
}