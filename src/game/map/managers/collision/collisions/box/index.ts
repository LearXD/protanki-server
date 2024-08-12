import { Vector3d } from "@/utils/vector-3d";
import { CollisionShape } from "../shape";
import { AABB } from "../../utils/aabb";
import { Matrix4 } from "../../utils/matrix-4";

export class CollisionBox extends CollisionShape {


    public hs: Vector3d;

    public constructor(param1: Vector3d, param2: number, param3: any/*PhysicsMaterial*/) {
        super(CollisionShape.BOX, param2, param3);
        this.hs = new Vector3d();
        this.hs.copy(param1);
    }

    public override calculateAABB(): AABB {
        var _loc1_: Matrix4 = null;
        var _loc2_: AABB = null;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        _loc1_ = this.transform;
        _loc2_ = this.aabb;
        _loc3_ = _loc1_.m00 < 0 ? (-_loc1_.m00) : (_loc1_.m00);
        _loc4_ = _loc1_.m01 < 0 ? (-_loc1_.m01) : (_loc1_.m01);
        _loc5_ = _loc1_.m02 < 0 ? (-_loc1_.m02) : (_loc1_.m02);
        _loc2_.maxX = this.hs.x * _loc3_ + this.hs.y * _loc4_ + this.hs.z * _loc5_;
        _loc2_.minX = -_loc2_.maxX;
        _loc3_ = _loc1_.m10 < 0 ? (-_loc1_.m10) : (_loc1_.m10);
        _loc4_ = _loc1_.m11 < 0 ? (-_loc1_.m11) : (_loc1_.m11);
        _loc5_ = _loc1_.m12 < 0 ? (-_loc1_.m12) : (_loc1_.m12);
        _loc2_.maxY = this.hs.x * _loc3_ + this.hs.y * _loc4_ + this.hs.z * _loc5_;
        _loc2_.minY = -_loc2_.maxY;
        _loc3_ = _loc1_.m20 < 0 ? (-_loc1_.m20) : (_loc1_.m20);
        _loc4_ = _loc1_.m21 < 0 ? (-_loc1_.m21) : (_loc1_.m21);
        _loc5_ = _loc1_.m22 < 0 ? (-_loc1_.m22) : (_loc1_.m22);
        _loc2_.maxZ = this.hs.x * _loc3_ + this.hs.y * _loc4_ + this.hs.z * _loc5_;
        _loc2_.minZ = -_loc2_.maxZ;
        _loc2_.minX += _loc1_.m03;
        _loc2_.maxX += _loc1_.m03;
        _loc2_.minY += _loc1_.m13;
        _loc2_.maxY += _loc1_.m13;
        _loc2_.minZ += _loc1_.m23;
        _loc2_.maxZ += _loc1_.m23;
        return _loc2_;
    }

    public override copyFrom(param1: CollisionShape): CollisionShape {
        var _loc2_: CollisionBox = param1 as CollisionBox;
        if (_loc2_ == null) {
            return this;
        }
        super.copyFrom(_loc2_);
        this.hs.copy(_loc2_.hs);
        return this;
    }

    protected override  createPrimitive(): CollisionShape {
        return new CollisionBox(this.hs, this.collisionGroup, this.material);
    }

    public override raycast(param1: Vector3d, param2: Vector3d, param3: number, param4: Vector3d): number {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: Matrix4 = this.transform;
        var _loc8_: number = -1;
        var _loc9_: number = 1e+308;
        var _loc10_: number = param1.x - _loc7_.m03;
        var _loc11_: number = param1.y - _loc7_.m13;
        var _loc12_: number = param1.z - _loc7_.m23;
        var _loc13_: number = _loc7_.m00 * _loc10_ + _loc7_.m10 * _loc11_ + _loc7_.m20 * _loc12_;
        var _loc14_: number = _loc7_.m01 * _loc10_ + _loc7_.m11 * _loc11_ + _loc7_.m21 * _loc12_;
        var _loc15_: number = _loc7_.m02 * _loc10_ + _loc7_.m12 * _loc11_ + _loc7_.m22 * _loc12_;
        _loc10_ = _loc7_.m00 * param2.x + _loc7_.m10 * param2.y + _loc7_.m20 * param2.z;
        _loc11_ = _loc7_.m01 * param2.x + _loc7_.m11 * param2.y + _loc7_.m21 * param2.z;
        _loc12_ = _loc7_.m02 * param2.x + _loc7_.m12 * param2.y + _loc7_.m22 * param2.z;
        if (_loc10_ < param3 && _loc10_ > -param3) {
            if (_loc13_ < -this.hs.x || _loc13_ > this.hs.x) {
                return -1;
            }
        }
        else {
            _loc5_ = (-this.hs.x - _loc13_) / _loc10_;
            _loc6_ = (this.hs.x - _loc13_) / _loc10_;
            if (_loc5_ < _loc6_) {
                if (_loc5_ > _loc8_) {
                    _loc8_ = _loc5_;
                    param4.x = -1;
                    param4.y = param4.z = 0;
                }
                if (_loc6_ < _loc9_) {
                    _loc9_ = _loc6_;
                }
            }
            else {
                if (_loc6_ > _loc8_) {
                    _loc8_ = _loc6_;
                    param4.x = 1;
                    param4.y = param4.z = 0;
                }
                if (_loc5_ < _loc9_) {
                    _loc9_ = _loc5_;
                }
            }
            if (_loc9_ < _loc8_) {
                return -1;
            }
        }
        if (_loc11_ < param3 && _loc11_ > -param3) {
            if (_loc14_ < -this.hs.y || _loc14_ > this.hs.y) {
                return -1;
            }
        }
        else {
            _loc5_ = (-this.hs.y - _loc14_) / _loc11_;
            _loc6_ = (this.hs.y - _loc14_) / _loc11_;
            if (_loc5_ < _loc6_) {
                if (_loc5_ > _loc8_) {
                    _loc8_ = _loc5_;
                    param4.y = -1;
                    param4.x = param4.z = 0;
                }
                if (_loc6_ < _loc9_) {
                    _loc9_ = _loc6_;
                }
            }
            else {
                if (_loc6_ > _loc8_) {
                    _loc8_ = _loc6_;
                    param4.y = 1;
                    param4.x = param4.z = 0;
                }
                if (_loc5_ < _loc9_) {
                    _loc9_ = _loc5_;
                }
            }
            if (_loc9_ < _loc8_) {
                return -1;
            }
        }
        if (_loc12_ < param3 && _loc12_ > -param3) {
            if (_loc15_ < -this.hs.z || _loc15_ > this.hs.z) {
                return -1;
            }
        }
        else {
            _loc5_ = (-this.hs.z - _loc15_) / _loc12_;
            _loc6_ = (this.hs.z - _loc15_) / _loc12_;
            if (_loc5_ < _loc6_) {
                if (_loc5_ > _loc8_) {
                    _loc8_ = _loc5_;
                    param4.z = -1;
                    param4.x = param4.y = 0;
                }
                if (_loc6_ < _loc9_) {
                    _loc9_ = _loc6_;
                }
            }
            else {
                if (_loc6_ > _loc8_) {
                    _loc8_ = _loc6_;
                    param4.z = 1;
                    param4.x = param4.y = 0;
                }
                if (_loc5_ < _loc9_) {
                    _loc9_ = _loc5_;
                }
            }
            if (_loc9_ < _loc8_) {
                return -1;
            }
        }
        _loc10_ = param4.x;
        _loc11_ = param4.y;
        _loc12_ = param4.z;
        param4.x = _loc7_.m00 * _loc10_ + _loc7_.m01 * _loc11_ + _loc7_.m02 * _loc12_;
        param4.y = _loc7_.m10 * _loc10_ + _loc7_.m11 * _loc11_ + _loc7_.m12 * _loc12_;
        param4.z = _loc7_.m20 * _loc10_ + _loc7_.m21 * _loc11_ + _loc7_.m22 * _loc12_;
        return _loc8_;
    }
}
