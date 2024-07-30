export interface IVector3d {
    x?: number,
    y?: number,
    z?: number
}

export class Vector3d implements IVector3d {
    constructor(public x: number = 0, public z: number = 0, public y: number = 0) { }

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

        return new Vector3d(vector.x, swap ? vector.y : vector.z, swap ? vector.z : vector.y)
    }

    public toObject(): IVector3d {
        // TODO: why the z and y are swapped?
        return { x: this.x, y: this.z, z: this.y }
    }

    public toString() {
        return `(X: ${this.x} Y: ${this.y} Z: ${this.z})`
    }
}