import { IVector3d } from "./types"

export class Vector3d implements IVector3d {

    public constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) { }

    public add(vector: Vector3d) {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
    }

    public distanceTo(vector: Vector3d): number {
        return Math.sqrt(
            Math.pow(this.x - vector.x, 2) +
            Math.pow(this.y - vector.y, 2) +
            Math.pow(this.z - vector.z, 2)
        )
    }

    public static fromInterface(vector: IVector3d, swap: boolean = true): Vector3d {

        if (typeof vector.x === 'string') {
            vector.x = parseFloat(vector.x)
        }

        if (typeof vector.y === 'string') {
            vector.y = parseFloat(vector.y)
        }

        if (typeof vector.z === 'string') {
            vector.z = parseFloat(vector.z)
        }

        return new Vector3d(
            vector.x,
            swap ? vector.z : vector.y,
            swap ? vector.y : vector.z
        )
    }

    public toObject(swap: boolean = true): IVector3d {
        return { x: this.x, y: swap ? this.z : this.y, z: swap ? this.y : this.z }
    }

    public toString() {
        return `(X: ${this.x} Y: ${this.y} Z: ${this.z})`
    }
}