import { Vector3d } from "@/utils/vector-3d";
import { CollisionShape } from "../shape";
import { AABB } from "../../utils/aabb";
import { Matrix4 } from "../../utils/matrix-4";

export class CollisionTriangle extends CollisionShape {


    public v0: Vector3d;

    public v1: Vector3d;

    public v2: Vector3d;

    public e0: Vector3d;

    public e1: Vector3d;

    public e2: Vector3d;

    public constructor(param1: Vector3d, param2: Vector3d, param3: Vector3d, param4: number, param5: any/*PhysicsMaterial*/) {
        super(CollisionShape.TRIANGLE, param4, param5);
        this.v0 = new Vector3d();
        this.v1 = new Vector3d();
        this.v2 = new Vector3d();
        this.e0 = new Vector3d();
        this.e1 = new Vector3d();
        this.e2 = new Vector3d();
        this.initVertices(param1, param2, param3);
    }

    public override calculateAABB(): AABB {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: AABB = this.aabb;
        var _loc4_: Matrix4 = this.transform;
        var _loc5_: number;
        var _loc6_: number = (_loc5_ = 0.005) * _loc4_.m02;
        var _loc7_: number = _loc5_ * _loc4_.m12;
        var _loc8_: number = _loc5_ * _loc4_.m22;
        _loc1_ = this.v0.x * _loc4_.m00 + this.v0.y * _loc4_.m01;
        _loc3_.minX = _loc3_.maxX = _loc1_ + _loc6_;
        _loc2_ = _loc1_ - _loc6_;
        if (_loc2_ > _loc3_.maxX) {
            _loc3_.maxX = _loc2_;
        }
        else if (_loc2_ < _loc3_.minX) {
            _loc3_.minX = _loc2_;
        }
        _loc1_ = this.v0.x * _loc4_.m10 + this.v0.y * _loc4_.m11;
        _loc3_.minY = _loc3_.maxY = _loc1_ + _loc7_;
        _loc2_ = _loc1_ - _loc7_;
        if (_loc2_ > _loc3_.maxY) {
            _loc3_.maxY = _loc2_;
        }
        else if (_loc2_ < _loc3_.minY) {
            _loc3_.minY = _loc2_;
        }
        _loc1_ = this.v0.x * _loc4_.m20 + this.v0.y * _loc4_.m21;
        _loc3_.minZ = _loc3_.maxZ = _loc1_ + _loc8_;
        _loc2_ = _loc1_ - _loc8_;
        if (_loc2_ > _loc3_.maxZ) {
            _loc3_.maxZ = _loc2_;
        }
        else if (_loc2_ < _loc3_.minZ) {
            _loc3_.minZ = _loc2_;
        }
        _loc1_ = this.v1.x * _loc4_.m00 + this.v1.y * _loc4_.m01;
        _loc2_ = _loc1_ + _loc6_;
        if (_loc2_ > _loc3_.maxX) {
            _loc3_.maxX = _loc2_;
        }
        else if (_loc2_ < _loc3_.minX) {
            _loc3_.minX = _loc2_;
        }
        _loc2_ = _loc1_ - _loc6_;
        if (_loc2_ > _loc3_.maxX) {
            _loc3_.maxX = _loc2_;
        }
        else if (_loc2_ < _loc3_.minX) {
            _loc3_.minX = _loc2_;
        }
        _loc1_ = this.v1.x * _loc4_.m10 + this.v1.y * _loc4_.m11;
        _loc2_ = _loc1_ + _loc7_;
        if (_loc2_ > _loc3_.maxY) {
            _loc3_.maxY = _loc2_;
        }
        else if (_loc2_ < _loc3_.minY) {
            _loc3_.minY = _loc2_;
        }
        _loc2_ = _loc1_ - _loc7_;
        if (_loc2_ > _loc3_.maxY) {
            _loc3_.maxY = _loc2_;
        }
        else if (_loc2_ < _loc3_.minY) {
            _loc3_.minY = _loc2_;
        }
        _loc1_ = this.v1.x * _loc4_.m20 + this.v1.y * _loc4_.m21;
        _loc2_ = _loc1_ + _loc8_;
        if (_loc2_ > _loc3_.maxZ) {
            _loc3_.maxZ = _loc2_;
        }
        else if (_loc2_ < _loc3_.minZ) {
            _loc3_.minZ = _loc2_;
        }
        _loc2_ = _loc1_ - _loc8_;
        if (_loc2_ > _loc3_.maxZ) {
            _loc3_.maxZ = _loc2_;
        }
        else if (_loc2_ < _loc3_.minZ) {
            _loc3_.minZ = _loc2_;
        }
        _loc1_ = this.v2.x * _loc4_.m00 + this.v2.y * _loc4_.m01;
        _loc2_ = _loc1_ + _loc6_;
        if (_loc2_ > _loc3_.maxX) {
            _loc3_.maxX = _loc2_;
        }
        else if (_loc2_ < _loc3_.minX) {
            _loc3_.minX = _loc2_;
        }
        _loc2_ = _loc1_ - _loc6_;
        if (_loc2_ > _loc3_.maxX) {
            _loc3_.maxX = _loc2_;
        }
        else if (_loc2_ < _loc3_.minX) {
            _loc3_.minX = _loc2_;
        }
        _loc1_ = this.v2.x * _loc4_.m10 + this.v2.y * _loc4_.m11;
        _loc2_ = _loc1_ + _loc7_;
        if (_loc2_ > _loc3_.maxY) {
            _loc3_.maxY = _loc2_;
        }
        else if (_loc2_ < _loc3_.minY) {
            _loc3_.minY = _loc2_;
        }
        _loc2_ = _loc1_ - _loc7_;
        if (_loc2_ > _loc3_.maxY) {
            _loc3_.maxY = _loc2_;
        }
        else if (_loc2_ < _loc3_.minY) {
            _loc3_.minY = _loc2_;
        }
        _loc1_ = this.v2.x * _loc4_.m20 + this.v2.y * _loc4_.m21;
        _loc2_ = _loc1_ + _loc8_;
        if (_loc2_ > _loc3_.maxZ) {
            _loc3_.maxZ = _loc2_;
        }
        else if (_loc2_ < _loc3_.minZ) {
            _loc3_.minZ = _loc2_;
        }
        _loc2_ = _loc1_ - _loc8_;
        if (_loc2_ > _loc3_.maxZ) {
            _loc3_.maxZ = _loc2_;
        }
        else if (_loc2_ < _loc3_.minZ) {
            _loc3_.minZ = _loc2_;
        }
        _loc3_.minX += _loc4_.m03;
        _loc3_.maxX += _loc4_.m03;
        _loc3_.minY += _loc4_.m13;
        _loc3_.maxY += _loc4_.m13;
        _loc3_.minZ += _loc4_.m23;
        _loc3_.maxZ += _loc4_.m23;
        return _loc3_;
    }

    public override raycast(param1: Vector3d, param2: Vector3d, param3: number, param4: Vector3d): number {
        var _loc5_: Matrix4 = null;
        _loc5_ = this.transform;
        var _loc6_: number;
        if ((_loc6_ = param2.x * _loc5_.m02 + param2.y * _loc5_.m12 + param2.z * _loc5_.m22) < param3 && _loc6_ > -param3) {
            return -1;
        }
        var _loc7_: number = param1.x - _loc5_.m03;
        var _loc8_: number = param1.y - _loc5_.m13;
        var _loc9_: number = param1.z - _loc5_.m23;
        var _loc11_: number;
        var _loc10_: number;
        if ((_loc11_ = -(_loc10_ = _loc7_ * _loc5_.m02 + _loc8_ * _loc5_.m12 + _loc9_ * _loc5_.m22) / _loc6_) < 0) {
            return -1;
        }
        var _loc12_: number = _loc7_ * _loc5_.m00 + _loc8_ * _loc5_.m10 + _loc9_ * _loc5_.m20;
        var _loc13_: number = _loc7_ * _loc5_.m01 + _loc8_ * _loc5_.m11 + _loc9_ * _loc5_.m21;
        _loc7_ = _loc12_ + _loc11_ * (param2.x * _loc5_.m00 + param2.y * _loc5_.m10 + param2.z * _loc5_.m20);
        _loc8_ = _loc13_ + _loc11_ * (param2.x * _loc5_.m01 + param2.y * _loc5_.m11 + param2.z * _loc5_.m21);
        if (this.e0.x * (_loc8_ - this.v0.y) - this.e0.y * (_loc7_ - this.v0.x) < 0 || this.e1.x * (_loc8_ - this.v1.y) - this.e1.y * (_loc7_ - this.v1.x) < 0 || this.e2.x * (_loc8_ - this.v2.y) - this.e2.y * (_loc7_ - this.v2.x) < 0) {
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
        return _loc11_;
    }

    public override copyFrom(param1: CollisionShape): CollisionShape {
        super.copyFrom(param1);
        var _loc2_: CollisionTriangle = param1 as CollisionTriangle;
        if (_loc2_ != null) {
            this.v0.copy(_loc2_.v0);
            this.v1.copy(_loc2_.v1);
            this.v2.copy(_loc2_.v2);
            this.e0.copy(_loc2_.e0);
            this.e1.copy(_loc2_.e1);
            this.e2.copy(_loc2_.e2);
        }
        return this;
    }

    protected override  createPrimitive(): CollisionShape {
        return new CollisionTriangle(this.v0, this.v1, this.v2, this.collisionGroup, this.material);
    }

    private initVertices(param1: Vector3d, param2: Vector3d, param3: Vector3d): void {
        this.v0.copy(param1);
        this.v1.copy(param2);
        this.v2.copy(param3);
        this.e0.diff(param2, param1);
        this.e0.normalize();
        this.e1.diff(param3, param2);
        this.e1.normalize();
        this.e2.diff(param1, param3);
        this.e2.normalize();
    }
}
