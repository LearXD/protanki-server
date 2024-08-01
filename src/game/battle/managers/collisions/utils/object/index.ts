import { Player } from "@/game/player";
import { Logger } from "@/utils/logger";
import { Vector3d } from "@/utils/vector-3d";

export abstract class BattleObject {

    constructor(
        public readonly name: string,
        public readonly position: Vector3d,
        public readonly scale: number = 1,
    ) { }

    public getName() {
        return this.name;
    }

    public isColliding(position: Vector3d) {
        return this.position.distanceTo(position) <= this.scale;
    }

    public setPosition(position: Vector3d) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    }

    public abstract handleCollision(player: Player): boolean
}