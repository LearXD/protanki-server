import { Vector3d } from "@/utils/vector-3d";
import { ICollisionBox } from "../../types";

export class MapCollisionBox {
    public constructor(
        public readonly data: ICollisionBox
    ) { }

    public getPosition() {
        return Vector3d.fromInterface(this.data.position, false)
    }

    public getSize() {
        return Vector3d.fromInterface(this.data.size, false)
    }

    public getRotation() {
        return Vector3d.fromInterface(this.data.rotation, false)
    }

    public isColliding(position: Vector3d, ignoreY: boolean = false) {
        return (
            position.getX() >= this.getPosition().getX() - this.getSize().getX() / 2 &&
            position.getX() <= this.getPosition().getX() + this.getSize().getX() / 2 &&
            (ignoreY || (
                position.getY() >= this.getPosition().getY() - this.getSize().getY() / 2 &&
                position.getY() <= this.getPosition().getY() + this.getSize().getY() / 2
            )) &&
            position.getZ() >= this.getPosition().getZ() - this.getSize().getZ() / 2 &&
            position.getZ() <= this.getPosition().getZ() + this.getSize().getZ() / 2
        )
    }
}