import { Vector3d } from "@/utils/vector-3d";
import { CollisionShape } from "../../collisions/shape";

export class RayHit {


    public shape: CollisionShape;

    public position: Vector3d;

    public normal: Vector3d;

    public t: number = 0;

    public staticHit: boolean;

    public constructor() {
        this.position = new Vector3d();
        this.normal = new Vector3d();
        //  super();
    }

    public copy(param1: RayHit): void {
        this.shape = param1.shape;
        this.position.copy(param1.position);
        this.normal.copy(param1.normal);
        this.t = param1.t;
        this.staticHit = param1.staticHit;
    }

    public clear(): void {
        this.shape = null;
    }

    public clone(): RayHit {
        var _loc1_: RayHit = new RayHit();
        _loc1_.copy(this);
        return _loc1_;
    }
}

