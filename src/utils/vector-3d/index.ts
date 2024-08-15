import { Vector2d } from "../vector-2d"
import { IVector3d } from "./types"

export class Vector3d extends Vector2d implements IVector3d {

    public static readonly ZERO: Vector3d = new Vector3d(0, 0, 0);
    public static readonly X_AXIS: Vector3d = new Vector3d(1, 0, 0);
    public static readonly Y_AXIS: Vector3d = new Vector3d(0, 1, 0);
    public static readonly Z_AXIS: Vector3d = new Vector3d(0, 0, 1);


    public static readonly RIGHT: Vector3d = new Vector3d(1, 0, 0);
    public static readonly LEFT: Vector3d = new Vector3d(-1, 0, 0);
    public static readonly FORWARD: Vector3d = new Vector3d(0, 1, 0);
    public static readonly BACKWARD: Vector3d = new Vector3d(0, -1, 0);
    public static readonly DOWN: Vector3d = new Vector3d(0, 0, -1);

    public constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) {
        super(x, y)
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

    public static copy(vector: Vector3d): Vector3d {
        return new Vector3d(vector.x, vector.y, vector.z)
    }

    public static zero(): Vector3d {
        return new Vector3d()
    }

    public getZ() {
        return this.z
    }

    public add(vector: Vector3d) {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
        return this
    }

    public subtract(vector: Vector3d) {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
        return this
    }

    public copy(vector: Vector3d) {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        return this
    }

    public scale(value: number): Vector3d {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        return this;
    }

    public diff(param1: Vector3d, param2: Vector3d): Vector3d {
        this.x = param1.x - param2.x;
        this.y = param1.y - param2.y;
        this.z = param1.z - param2.z;
        return this;
    }

    public reset(
        x: number = 0,
        y: number = 0,
        z: number = 0
    ) {
        this.x = x
        this.y = y
        this.z = z
        return this
    }

    public normalize(): Vector3d {
        var _loc1_: number = this.x * this.x + this.y * this.y + this.z * this.z;
        if (_loc1_ == 0) {
            this.x = 1;
        } else {
            _loc1_ = Math.sqrt(_loc1_);
            this.x /= _loc1_;
            this.y /= _loc1_;
            this.z /= _loc1_;
        }
        return this;
    }

    public dot(param1: Vector3d): number {
        return this.x * param1.x + this.y * param1.y + this.z * param1.z;
    }

    public cross2(param1: Vector3d, param2: Vector3d): Vector3d {
        this.x = param1.y * param2.z - param1.z * param2.y;
        this.y = param1.z * param2.x - param1.x * param2.z;
        this.z = param1.x * param2.y - param1.y * param2.x;
        return this;
    }

    public distanceTo(vector: Vector3d): number {
        return Math.sqrt(
            Math.pow(this.x - vector.x, 2) +
            Math.pow(this.y - vector.y, 2) +
            Math.pow(this.z - vector.z, 2)
        )
    }

    public swap(): Vector3d {
        return new Vector3d(this.x, this.z, this.y)
    }

    public toArray(): [number, number, number] {
        return [this.x, this.y, this.z]
    }

    public toObject(swap: boolean = true): IVector3d {
        return { x: this.x, y: swap ? this.z : this.y, z: swap ? this.y : this.z }
    }

    public toString() {
        return `(X: ${this.x} Y: ${this.y} Z: ${this.z})`
    }
}