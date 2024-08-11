import { AABB } from "@/utils/aabb";
import { Matrix4 } from "@/utils/matrix-4";
import { Vector3d } from "@/utils/vector-3d";

export class CollisionShape {

    public static readonly BOX: number = 1;

    public static readonly SPHERE: number = 2;

    public static readonly RECT: number = 4;

    public static readonly TRIANGLE: number = 8;


    public type: number;

    public collisionGroup: number;

    public body: Body;

    public localTransform: Matrix4;

    public transform: Matrix4;

    public aabb: AABB;

    public material: any;

    public constructor(param1: number, param2: number, param3: any) {
        this.transform = new Matrix4();
        this.aabb = new AABB();
        //  super();
        this.type = param1;
        this.collisionGroup = param2;
        this.material = param3;
    }

    public setBody(param1: Body, param2: Matrix4 = null): void {
        if (this.body == param1) {
            return;
        }
        this.body = param1;
        if (param1 != null) {
            if (param2 != null) {
                if (this.localTransform == null) {
                    this.localTransform = new Matrix4();
                }
                this.localTransform.copy(param2);
            }
            else {
                this.localTransform = null;
            }
        }
    }

    public calculateAABB(): AABB {
        return this.aabb;
    }

    public raycast(param1: Vector3d, param2: Vector3d, param3: number, param4: Vector3d): number {
        return -1;
    }

    public clone(): CollisionShape {
        var _loc1_: CollisionShape = this.createPrimitive();
        return _loc1_.copyFrom(this);
    }

    public copyFrom(param1: CollisionShape): CollisionShape {
        if (param1 == null) {
            throw new Error("Parameter source cannot be null");
        }
        this.type = param1.type;
        this.transform.copy(param1.transform);
        this.collisionGroup = param1.collisionGroup;
        this.setBody(param1.body, param1.localTransform);
        this.aabb.copyFrom(param1.aabb);
        return this;
    }

    protected createPrimitive(): CollisionShape {
        return new CollisionShape(this.type, this.collisionGroup, this.material);
    }
}

