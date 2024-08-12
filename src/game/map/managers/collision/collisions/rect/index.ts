import { Vector3d } from "@/utils/vector-3d";
import { CollisionShape } from "../shape";
import { Matrix4 } from "../../utils/matrix-4";
import { AABB } from "../../utils/aabb";

export class CollisionRect extends CollisionShape {

    private static EPSILON: number = 0.005;

    public hs: Vector3d;

    public constructor(param1: Vector3d, param2: number, param3: any/*PhysicsMaterial*/) {
        super(CollisionShape.RECT, param2, param3);
        this.hs = new Vector3d();
        this.hs.copy(param1);
    }

    public override  calculateAABB(): AABB {
        var _loc1_: Matrix4 = null;
        _loc1_ = null;
        _loc1_ = this.transform;
        var _loc2_: number = _loc1_.m00 < 0 ? -_loc1_.m00 : _loc1_.m00;
        var _loc3_: number = _loc1_.m01 < 0 ? -_loc1_.m01 : _loc1_.m01;
        var _loc4_: number = _loc1_.m02 < 0 ? -_loc1_.m02 : _loc1_.m02;
        var _loc5_: AABB;
        (_loc5_ = this.aabb).maxX = this.hs.x * _loc2_ + this.hs.y * _loc3_ + CollisionRect.EPSILON * _loc4_;
        _loc5_.minX = -_loc5_.maxX;
        _loc2_ = _loc1_.m10 < 0 ? (-_loc1_.m10) : (_loc1_.m10);
        _loc3_ = _loc1_.m11 < 0 ? (-_loc1_.m11) : (_loc1_.m11);
        _loc4_ = _loc1_.m12 < 0 ? (-_loc1_.m12) : (_loc1_.m12);
        _loc5_.maxY = this.hs.x * _loc2_ + this.hs.y * _loc3_ + CollisionRect.EPSILON * _loc4_;
        _loc5_.minY = -_loc5_.maxY;
        _loc2_ = _loc1_.m20 < 0 ? (-_loc1_.m20) : (_loc1_.m20);
        _loc3_ = _loc1_.m21 < 0 ? (-_loc1_.m21) : (_loc1_.m21);
        _loc4_ = _loc1_.m22 < 0 ? (-_loc1_.m22) : (_loc1_.m22);
        _loc5_.maxZ = this.hs.x * _loc2_ + this.hs.y * _loc3_ + CollisionRect.EPSILON * _loc4_;
        _loc5_.minZ = -_loc5_.maxZ;
        _loc5_.minX += _loc1_.m03;
        _loc5_.maxX += _loc1_.m03;
        _loc5_.minY += _loc1_.m13;
        _loc5_.maxY += _loc1_.m13;
        _loc5_.minZ += _loc1_.m23;
        _loc5_.maxZ += _loc1_.m23;
        return _loc5_;
    }

    public override copyFrom(param1: CollisionShape): CollisionShape {
        var _loc2_: CollisionRect = param1 as CollisionRect;
        if (_loc2_ == null) {
            return this;
        }
        super.copyFrom(_loc2_);
        this.hs.copy(_loc2_.hs);
        return this;
    }

    protected override createPrimitive(): CollisionShape {
        return new CollisionRect(this.hs, this.collisionGroup, this.material);
    }

    public override raycast(param1: Vector3d, param2: Vector3d, param3: number, param4: Vector3d): number {
        var _loc5_: Matrix4 = null;
        _loc5_ = this.transform;
        var _loc6_: number = param1.x - _loc5_.m03;
        var _loc7_: number = param1.y - _loc5_.m13;
        var _loc8_: number = param1.z - _loc5_.m23;
        var _loc9_: number = _loc5_.m00 * _loc6_ + _loc5_.m10 * _loc7_ + _loc5_.m20 * _loc8_;
        var _loc10_: number = _loc5_.m01 * _loc6_ + _loc5_.m11 * _loc7_ + _loc5_.m21 * _loc8_;
        var _loc11_: number = _loc5_.m02 * _loc6_ + _loc5_.m12 * _loc7_ + _loc5_.m22 * _loc8_;
        _loc6_ = _loc5_.m00 * param2.x + _loc5_.m10 * param2.y + _loc5_.m20 * param2.z;
        _loc7_ = _loc5_.m01 * param2.x + _loc5_.m11 * param2.y + _loc5_.m21 * param2.z;
        if ((_loc8_ = _loc5_.m02 * param2.x + _loc5_.m12 * param2.y + _loc5_.m22 * param2.z) > -param3 && _loc8_ < param3) {
            return -1;
        }
        var _loc12_: number;
        if ((_loc12_ = -_loc11_ / _loc8_) < 0) {
            return -1;
        }
        _loc9_ += _loc6_ * _loc12_;
        _loc10_ += _loc7_ * _loc12_;
        _loc11_ = 0;
        if (_loc9_ < -this.hs.x - param3 || _loc9_ > this.hs.x + param3 || _loc10_ < -this.hs.y - param3 || _loc10_ > this.hs.y + param3) {
            return -1;
        }
        if (param2.x * _loc5_.m02 + param2.y * _loc5_.m12 + param2.z * _loc5_.m22 > 0) {
            param4.x = -_loc5_.m02;
            param4.y = -_loc5_.m12;
            param4.z = -_loc5_.m22;
        }
        else {
            param4.x = _loc5_.m02;
            param4.y = _loc5_.m12;
            param4.z = _loc5_.m22;
        }
        return _loc12_;
    }
}
