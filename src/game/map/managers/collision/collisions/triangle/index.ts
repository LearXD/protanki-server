import { Vector3d } from "@/utils/vector-3d";
import { ICollisionTriangle } from "../../types";
import { Vector2d } from "@/utils/vector-2d";

export class MapCollisionTriangle {
    public constructor(
        public readonly data: ICollisionTriangle
    ) { }

    public getPosition() {
        return Vector3d.fromInterface(this.data.position, false)
    }

    public getVertices() {
        return this.data.vertices.map(vertex => Vector3d.fromInterface(vertex, false))
    }

    public getRotation() {
        return Vector3d.fromInterface(this.data.rotation, false)
    }

    public static calculateArea(a: Vector3d, b: Vector3d, c: Vector3d) {
        return Math.abs((a.getX() * (b.getZ() - c.getZ()) + b.getX() * (c.getZ() - a.getZ()) + c.getX() * (a.getZ() - b.getZ())) / 2.0);
    }

    public isColliding(position: Vector3d) {
        const [a, b, c] = this.getVertices()

        const area = MapCollisionTriangle.calculateArea(a, b, c)
        const area1 = MapCollisionTriangle.calculateArea(position, b, c)
        const area2 = MapCollisionTriangle.calculateArea(a, position, c)
        const area3 = MapCollisionTriangle.calculateArea(a, b, position)

        return area === (area1 + area2 + area3)
    }
}