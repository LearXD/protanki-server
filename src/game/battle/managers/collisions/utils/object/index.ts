import { Player } from "@/game/player";
import { Vector3d } from "@/utils/vector-3d";

export abstract class BattleObject {

    public colliding: Set<Player> = new Set();

    constructor(
        public readonly name: string,
        public readonly position: Vector3d,
        public readonly scale: number = 1,
    ) { }

    public setPosition(position: Vector3d) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    }

    public isColliding(player: Player): boolean {
        return this.colliding.has(player);
    }

    public onStartColliding(player: Player): void { }

    public onStopColliding(player: Player): void { }

    public onColliding(player: Player): boolean {
        return false;
    }

    public update(number: number) { }
}