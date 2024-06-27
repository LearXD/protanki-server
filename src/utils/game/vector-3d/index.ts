export class Vector3d {
    constructor(public x: number, public z: number, public y: number) { }

    public distanceTo(vector: Vector3d): number {
        return Math.sqrt(
            Math.pow(this.x - vector.x, 2) +
            Math.pow(this.y - vector.y, 2) +
            Math.pow(this.z - vector.z, 2)
        )
    }
}