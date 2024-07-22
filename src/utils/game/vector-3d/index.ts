export interface IVector3d {
    x: number,
    y: number,
    z: number
}

export class Vector3d implements IVector3d {
    constructor(public x: number, public z: number, public y: number) { }

    public distanceTo(vector: Vector3d): number {
        return Math.sqrt(
            Math.pow(this.x - vector.x, 2) +
            Math.pow(this.y - vector.y, 2) +
            Math.pow(this.z - vector.z, 2)
        )
    }

    public toObject(): IVector3d {
        // TODO: why the z and y are swapped?
        return { x: this.x, y: this.z, z: this.y }
    }
}