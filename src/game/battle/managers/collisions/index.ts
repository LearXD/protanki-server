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
        this.objects.set(object.name, object);
    }

    public removeObject(name: string) {
        if (this.objects.has(name)) {
            this.objects.delete(name);
        }
    }

    public checkObjectCollisions(player: Player, position?: Vector3d) {

        if (!player.tank || !player.tank.isVisible()) {
            return;
        }

        if (!position) {
            position = player.tank.getPosition();
        }

        for (const object of this.objects.values()) {
            if (object.position.distanceTo(position) <= object.scale) {

                if (!object.isColliding(player)) {
                    object.colliding.add(player);
                    object.onStartColliding(player);
                }

                const collided = object.onColliding(player);
                if (collided) {
                    this.objects.delete(object.name);
                }

                continue;
            }

            if (object.isColliding(player)) {
                object.colliding.delete(player);
                object.onStopColliding(player);
            }
        }
    }

    public onPlayerLeave(player: Player) {
        this.objects.forEach(object => {
            if (object.isColliding(player)) {
                object.colliding.delete(player);
                object.onStopColliding(player);
            }
        })
    }

    public handlePlayerMovement(player: Player) {
        this.battle.map.areaManager.checkCollisions(player)
        this.checkObjectCollisions(player)
    }

    public update(tick: number) {
        this.objects.forEach(object => {
            object.update(tick);
        })
    }
}