import { Matrix3 } from "../matrix-3";
import { Vector3d } from "../vector-3d";

export class Matrix4 {

    public static IDENTITY: Matrix4 = new Matrix4();

    public m00: number;

    public m01: number;

    public m02: number;

    public m03: number;

    public m10: number;

    public m11: number;

    public m12: number;

    public m13: number;

    public m20: number;

    public m21: number;

    public m22: number;

    public m23: number;

    public constructor(param1: number = 1, param2: number = 0, param3: number = 0, param4: number = 0, param5: number = 0, param6: number = 1, param7: number = 0, param8: number = 0, param9: number = 0, param10: number = 0, param11: number = 1, param12: number = 0) {
        //   super();
        this.init(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12);
    }

    public init(param1: number, param2: number, param3: number, param4: number, param5: number, param6: number, param7: number, param8: number, param9: number, param10: number, param11: number, param12: number): void {
        this.m00 = param1;
        this.m01 = param2;
        this.m02 = param3;
        this.m03 = param4;
        this.m10 = param5;
        this.m11 = param6;
        this.m12 = param7;
        this.m13 = param8;
        this.m20 = param9;
        this.m21 = param10;
        this.m22 = param11;
        this.m23 = param12;
    }

    public toIdentity(): Matrix4 {
        this.m00 = this.m11 = this.m22 = 1;
        this.m01 = this.m02 = this.m10 = this.m12 = this.m20 = this.m21 = this.m03 = this.m13 = this.m23 = 0;
        return this;
    }

    public invert(): Matrix4 {
        var _loc1_: number = this.m00;
        var _loc2_: number = this.m01;
        var _loc3_: number = this.m02;
        var _loc4_: number = this.m03;
        var _loc5_: number = this.m10;
        var _loc6_: number = this.m11;
        var _loc7_: number = this.m12;
        var _loc8_: number = this.m13;
        var _loc9_: number = this.m20;
        var _loc10_: number = this.m21;
        var _loc11_: number = this.m22;
        var _loc12_: number = this.m23;
        var _loc13_: number = -_loc3_ * _loc6_ * _loc9_ + _loc2_ * _loc7_ * _loc9_ + _loc3_ * _loc5_ * _loc10_ - _loc1_ * _loc7_ * _loc10_ - _loc2_ * _loc5_ * _loc11_ + _loc1_ * _loc6_ * _loc11_;
        this.m00 = (-_loc7_ * _loc10_ + _loc6_ * _loc11_) / _loc13_;
        this.m01 = (_loc3_ * _loc10_ - _loc2_ * _loc11_) / _loc13_;
        this.m02 = (-_loc3_ * _loc6_ + _loc2_ * _loc7_) / _loc13_;
        this.m03 = (_loc4_ * _loc7_ * _loc10_ - _loc3_ * _loc8_ * _loc10_ - _loc4_ * _loc6_ * _loc11_ + _loc2_ * _loc8_ * _loc11_ + _loc3_ * _loc6_ * _loc12_ - _loc2_ * _loc7_ * _loc12_) / _loc13_;
        this.m10 = (_loc7_ * _loc9_ - _loc5_ * _loc11_) / _loc13_;
        this.m11 = (-_loc3_ * _loc9_ + _loc1_ * _loc11_) / _loc13_;
        this.m12 = (_loc3_ * _loc5_ - _loc1_ * _loc7_) / _loc13_;
        this.m13 = (_loc3_ * _loc8_ * _loc9_ - _loc4_ * _loc7_ * _loc9_ + _loc4_ * _loc5_ * _loc11_ - _loc1_ * _loc8_ * _loc11_ - _loc3_ * _loc5_ * _loc12_ + _loc1_ * _loc7_ * _loc12_) / _loc13_;
        this.m20 = (-_loc6_ * _loc9_ + _loc5_ * _loc10_) / _loc13_;
        this.m21 = (_loc2_ * _loc9_ - _loc1_ * _loc10_) / _loc13_;
        this.m22 = (-_loc2_ * _loc5_ + _loc1_ * _loc6_) / _loc13_;
        this.m23 = (_loc4_ * _loc6_ * _loc9_ - _loc2_ * _loc8_ * _loc9_ - _loc4_ * _loc5_ * _loc10_ + _loc1_ * _loc8_ * _loc10_ + _loc2_ * _loc5_ * _loc12_ - _loc1_ * _loc6_ * _loc12_) / _loc13_;
        return this;
    }

    public append(param1: Matrix4): Matrix4 {
        var _loc2_: number = this.m00;
        var _loc3_: number = this.m01;
        var _loc4_: number = this.m02;
        var _loc5_: number = this.m03;
        var _loc6_: number = this.m10;
        var _loc7_: number = this.m11;
        var _loc8_: number = this.m12;
        var _loc9_: number = this.m13;
        var _loc10_: number = this.m20;
        var _loc11_: number = this.m21;
        var _loc12_: number = this.m22;
        var _loc13_: number = this.m23;
        this.m00 = param1.m00 * _loc2_ + param1.m01 * _loc6_ + param1.m02 * _loc10_;
        this.m01 = param1.m00 * _loc3_ + param1.m01 * _loc7_ + param1.m02 * _loc11_;
        this.m02 = param1.m00 * _loc4_ + param1.m01 * _loc8_ + param1.m02 * _loc12_;
        this.m03 = param1.m00 * _loc5_ + param1.m01 * _loc9_ + param1.m02 * _loc13_ + param1.m03;
        this.m10 = param1.m10 * _loc2_ + param1.m11 * _loc6_ + param1.m12 * _loc10_;
        this.m11 = param1.m10 * _loc3_ + param1.m11 * _loc7_ + param1.m12 * _loc11_;
        this.m12 = param1.m10 * _loc4_ + param1.m11 * _loc8_ + param1.m12 * _loc12_;
        this.m13 = param1.m10 * _loc5_ + param1.m11 * _loc9_ + param1.m12 * _loc13_ + param1.m13;
        this.m20 = param1.m20 * _loc2_ + param1.m21 * _loc6_ + param1.m22 * _loc10_;
        this.m21 = param1.m20 * _loc3_ + param1.m21 * _loc7_ + param1.m22 * _loc11_;
        this.m22 = param1.m20 * _loc4_ + param1.m21 * _loc8_ + param1.m22 * _loc12_;
        this.m23 = param1.m20 * _loc5_ + param1.m21 * _loc9_ + param1.m22 * _loc13_ + param1.m23;
        return this;
    }

    public prepend(param1: Matrix4): Matrix4 {
        var _loc2_: number = this.m00;
        var _loc3_: number = this.m01;
        var _loc4_: number = this.m02;
        var _loc5_: number = this.m03;
        var _loc6_: number = this.m10;
        var _loc7_: number = this.m11;
        var _loc8_: number = this.m12;
        var _loc9_: number = this.m13;
        var _loc10_: number = this.m20;
        var _loc11_: number = this.m21;
        var _loc12_: number = this.m22;
        var _loc13_: number = this.m23;
        this.m00 = _loc2_ * param1.m00 + _loc3_ * param1.m10 + _loc4_ * param1.m20;
        this.m01 = _loc2_ * param1.m01 + _loc3_ * param1.m11 + _loc4_ * param1.m21;
        this.m02 = _loc2_ * param1.m02 + _loc3_ * param1.m12 + _loc4_ * param1.m22;
        this.m03 = _loc2_ * param1.m03 + _loc3_ * param1.m13 + _loc4_ * param1.m23 + _loc5_;
        this.m10 = _loc6_ * param1.m00 + _loc7_ * param1.m10 + _loc8_ * param1.m20;
        this.m11 = _loc6_ * param1.m01 + _loc7_ * param1.m11 + _loc8_ * param1.m21;
        this.m12 = _loc6_ * param1.m02 + _loc7_ * param1.m12 + _loc8_ * param1.m22;
        this.m13 = _loc6_ * param1.m03 + _loc7_ * param1.m13 + _loc8_ * param1.m23 + _loc9_;
        this.m20 = _loc10_ * param1.m00 + _loc11_ * param1.m10 + _loc12_ * param1.m20;
        this.m21 = _loc10_ * param1.m01 + _loc11_ * param1.m11 + _loc12_ * param1.m21;
        this.m22 = _loc10_ * param1.m02 + _loc11_ * param1.m12 + _loc12_ * param1.m22;
        this.m23 = _loc10_ * param1.m03 + _loc11_ * param1.m13 + _loc12_ * param1.m23 + _loc13_;
        return this;
    }

    public add(param1: Matrix4): Matrix4 {
        this.m00 += param1.m00;
        this.m01 += param1.m01;
        this.m02 += param1.m02;
        this.m03 += param1.m03;
        this.m10 += param1.m10;
        this.m11 += param1.m11;
        this.m12 += param1.m12;
        this.m13 += param1.m13;
        this.m20 += param1.m20;
        this.m21 += param1.m21;
        this.m22 += param1.m22;
        this.m23 += param1.m23;
        return this;
    }

    public subtract(param1: Matrix4): Matrix4 {
        this.m00 -= param1.m00;
        this.m01 -= param1.m01;
        this.m02 -= param1.m02;
        this.m03 -= param1.m03;
        this.m10 -= param1.m10;
        this.m11 -= param1.m11;
        this.m12 -= param1.m12;
        this.m13 -= param1.m13;
        this.m20 -= param1.m20;
        this.m21 -= param1.m21;
        this.m22 -= param1.m22;
        this.m23 -= param1.m23;
        return this;
    }

    public transformVector(param1: Vector3d, param2: Vector3d): void {
        param2.x = this.m00 * param1.x + this.m01 * param1.y + this.m02 * param1.z + this.m03;
        param2.y = this.m10 * param1.x + this.m11 * param1.y + this.m12 * param1.z + this.m13;
        param2.z = this.m20 * param1.x + this.m21 * param1.y + this.m22 * param1.z + this.m23;
    }

    // renomeado
    public nativeConstDefault(param1: number, param2: number, param3: number, param4: Vector3d): void {
        param4.x = this.m00 * param1 + this.m01 * param2 + this.m02 * param3 + this.m03;
        param4.y = this.m10 * param1 + this.m11 * param2 + this.m12 * param3 + this.m13;
        param4.z = this.m20 * param1 + this.m21 * param2 + this.m22 * param3 + this.m23;
    }

    public transformVectorInverse(param1: Vector3d, param2: Vector3d): void {
        var _loc3_: number = param1.x - this.m03;
        var _loc4_: number = param1.y - this.m13;
        var _loc5_: number = param1.z - this.m23;
        param2.x = this.m00 * _loc3_ + this.m10 * _loc4_ + this.m20 * _loc5_;
        param2.y = this.m01 * _loc3_ + this.m11 * _loc4_ + this.m21 * _loc5_;
        param2.z = this.m02 * _loc3_ + this.m12 * _loc4_ + this.m22 * _loc5_;
    }

    public transformVectors(param1: Vector3d[], param2: Vector3d[]): void {
        var _loc3_: Vector3d = null;
        var _loc4_: Vector3d = null;
        var _loc5_: number = param1.length
        var _loc6_: number = 0;
        while (_loc6_ < _loc5_) {
            _loc3_ = param1[_loc6_];
            (_loc4_ = param2[_loc6_]).x = this.m00 * _loc3_.x + this.m01 * _loc3_.y + this.m02 * _loc3_.z + this.m03;
            _loc4_.y = this.m10 * _loc3_.x + this.m11 * _loc3_.y + this.m12 * _loc3_.z + this.m13;
            _loc4_.z = this.m20 * _loc3_.x + this.m21 * _loc3_.y + this.m22 * _loc3_.z + this.m23;
            _loc6_++;
        }
    }

    public transformVectorsN(param1: Vector3d[], param2: Vector3d[], param3: number): void {
        var _loc4_: Vector3d = null;
        var _loc5_: Vector3d = null;
        var _loc6_: number = 0;
        while (_loc6_ < param3) {
            _loc4_ = param1[_loc6_];
            (_loc5_ = param2[_loc6_]).x = this.m00 * _loc4_.x + this.m01 * _loc4_.y + this.m02 * _loc4_.z + this.m03;
            _loc5_.y = this.m10 * _loc4_.x + this.m11 * _loc4_.y + this.m12 * _loc4_.z + this.m13;
            _loc5_.z = this.m20 * _loc4_.x + this.m21 * _loc4_.y + this.m22 * _loc4_.z + this.m23;
            _loc6_++;
        }
    }

    public transformVectorsInverse(param1: Vector3d[], param2: Vector3d[]): void {
        var _loc3_: Vector3d = null;
        var _loc4_: Vector3d = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = param1.length;
        var _loc9_: number = 0;
        while (_loc9_ < _loc8_) {
            _loc3_ = param1[_loc9_];
            _loc4_ = param2[_loc9_];
            _loc5_ = _loc3_.x - this.m03;
            _loc6_ = _loc3_.y - this.m13;
            _loc7_ = _loc3_.z - this.m23;
            _loc4_.x = this.m00 * _loc5_ + this.m10 * _loc6_ + this.m20 * _loc7_;
            _loc4_.y = this.m01 * _loc5_ + this.m11 * _loc6_ + this.m21 * _loc7_;
            _loc4_.z = this.m02 * _loc5_ + this.m12 * _loc6_ + this.m22 * _loc7_;
            _loc9_++;
        }
    }

    public transformVectorsInverseN(param1: Vector3d[], param2: Vector3d[], param3: number): void {
        var _loc4_: Vector3d = null;
        var _loc5_: Vector3d = null;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = 0;
        while (_loc9_ < param3) {
            _loc4_ = param1[_loc9_];
            _loc5_ = param2[_loc9_];
            _loc6_ = _loc4_.x - this.m03;
            _loc7_ = _loc4_.y - this.m13;
            _loc8_ = _loc4_.z - this.m23;
            _loc5_.x = this.m00 * _loc6_ + this.m10 * _loc7_ + this.m20 * _loc8_;
            _loc5_.y = this.m01 * _loc6_ + this.m11 * _loc7_ + this.m21 * _loc8_;
            _loc5_.z = this.m02 * _loc6_ + this.m12 * _loc7_ + this.m22 * _loc8_;
            _loc9_++;
        }
    }

    public inPackageConst(param1: Vector3d): void {
        this.getAxis(0, param1);
    }

    public getForward(param1: Vector3d): void {
        this.getAxis(1, param1);
    }

    public getUp(param1: Vector3d): void {
        this.getAxis(2, param1);
    }

    public getAxis(param1: number, param2: Vector3d): void {
        switch (param1) {
            case 0:
                param2.x = this.m00;
                param2.y = this.m10;
                param2.z = this.m20;
                return;
            case 1:
                param2.x = this.m01;
                param2.y = this.m11;
                param2.z = this.m21;
                return;
            case 2:
                param2.x = this.m02;
                param2.y = this.m12;
                param2.z = this.m22;
                return;
            case 3:
                param2.x = this.m03;
                param2.y = this.m13;
                param2.z = this.m23;
                return;
            default:
                return;
        }
    }

    public deltaTransformVector(param1: Vector3d, param2: Vector3d): void {
        param2.x = this.m00 * param1.x + this.m01 * param1.y + this.m02 * param1.z;
        param2.y = this.m10 * param1.x + this.m11 * param1.y + this.m12 * param1.z;
        param2.z = this.m20 * param1.x + this.m21 * param1.y + this.m22 * param1.z;
    }

    public deltaTransformVectorInverse(param1: Vector3d, param2: Vector3d): void {
        param2.x = this.m00 * param1.x + this.m10 * param1.y + this.m20 * param1.z;
        param2.y = this.m01 * param1.x + this.m11 * param1.y + this.m21 * param1.z;
        param2.z = this.m02 * param1.x + this.m12 * param1.y + this.m22 * param1.z;
    }

    public copy(param1: Matrix4): Matrix4 {
        this.m00 = param1.m00;
        this.m01 = param1.m01;
        this.m02 = param1.m02;
        this.m03 = param1.m03;
        this.m10 = param1.m10;
        this.m11 = param1.m11;
        this.m12 = param1.m12;
        this.m13 = param1.m13;
        this.m20 = param1.m20;
        this.m21 = param1.m21;
        this.m22 = param1.m22;
        this.m23 = param1.m23;
        return this;
    }

    public setFromMatrix3(param1: Matrix3, param2: Vector3d): Matrix4 {
        this.m00 = param1.m00;
        this.m01 = param1.m01;
        this.m02 = param1.m02;
        this.m03 = param2.x;
        this.m10 = param1.m10;
        this.m11 = param1.m11;
        this.m12 = param1.m12;
        this.m13 = param2.y;
        this.m20 = param1.m20;
        this.m21 = param1.m21;
        this.m22 = param1.m22;
        this.m23 = param2.z;
        return this;
    }

    public setOrientationFromMatrix3(param1: Matrix3): Matrix4 {
        this.m00 = param1.m00;
        this.m01 = param1.m01;
        this.m02 = param1.m02;
        this.m10 = param1.m10;
        this.m11 = param1.m11;
        this.m12 = param1.m12;
        this.m20 = param1.m20;
        this.m21 = param1.m21;
        this.m22 = param1.m22;
        return this;
    }

    public setRotationMatrix(param1: number, param2: number, param3: number): Matrix4 {
        var _loc4_: number = Math.cos(param1);
        var _loc5_: number = Math.sin(param1);
        var _loc6_: number = Math.cos(param2);
        var _loc7_: number = Math.sin(param2);
        var _loc8_: number = Math.cos(param3);
        var _loc9_: number = Math.sin(param3);
        var _loc10_: number = _loc8_ * _loc7_;
        var _loc11_: number = _loc9_ * _loc7_;
        this.m00 = _loc8_ * _loc6_;
        this.m01 = _loc10_ * _loc5_ - _loc9_ * _loc4_;
        this.m02 = _loc10_ * _loc4_ + _loc9_ * _loc5_;
        this.m10 = _loc9_ * _loc6_;
        this.m11 = _loc11_ * _loc5_ + _loc8_ * _loc4_;
        this.m12 = _loc11_ * _loc4_ - _loc8_ * _loc5_;
        this.m20 = -_loc7_;
        this.m21 = _loc6_ * _loc5_;
        this.m22 = _loc6_ * _loc4_;
        return this;
    }

    //     public §9!A§(param1: Object3D): void
    //    {
    //         this.setMatrix(param1.x, param1.y, param1.z, param1.rotationX, param1.rotationY, param1.rotationZ);
    //     }

    public setMatrix(param1: number, param2: number, param3: number, param4: number, param5: number, param6: number): Matrix4 {
        var _loc7_: number = Math.cos(param4);
        var _loc8_: number = Math.sin(param4);
        var _loc9_: number = Math.cos(param5);
        var _loc10_: number = Math.sin(param5);
        var _loc11_: number = Math.cos(param6);
        var _loc12_: number = Math.sin(param6);
        var _loc13_: number = _loc11_ * _loc10_;
        var _loc14_: number = _loc12_ * _loc10_;
        this.m00 = _loc11_ * _loc9_;
        this.m01 = _loc13_ * _loc8_ - _loc12_ * _loc7_;
        this.m02 = _loc13_ * _loc7_ + _loc12_ * _loc8_;
        this.m03 = param1;
        this.m10 = _loc12_ * _loc9_;
        this.m11 = _loc14_ * _loc8_ + _loc11_ * _loc7_;
        this.m12 = _loc14_ * _loc7_ - _loc11_ * _loc8_;
        this.m13 = param2;
        this.m20 = -_loc10_;
        this.m21 = _loc9_ * _loc8_;
        this.m22 = _loc9_ * _loc7_;
        this.m23 = param3;
        return this;
    }

    public getEulerAngles(param1: Vector3d): void {
        if (- 1 < this.m20 && this.m20 < 1) {
            param1.x = Math.atan2(this.m21, this.m22);
            param1.y = -Math.asin(this.m20);
            param1.z = Math.atan2(this.m10, this.m00);
        }
        else {
            param1.x = 0;
            param1.y = this.m20 <= -1 ? Math.PI : -Math.PI;
            param1.y *= 0.5;
            param1.z = Math.atan2(-this.m01, this.m11);
        }
    }

    public setPosition(param1: Vector3d): void {
        this.m03 = param1.x;
        this.m13 = param1.y;
        this.m23 = param1.z;
    }

    public getPosition(param1: Vector3d): void {
        param1.x = this.m03;
        param1.y = this.m13;
        param1.z = this.m23;
    }

    public clone(): Matrix4 {
        return new Matrix4(this.m00, this.m01, this.m02, this.m03, this.m10, this.m11, this.m12, this.m13, this.m20, this.m21, this.m22, this.m23);
    }

    public toString(): String {
        return 'Matrix4'
        // return getQualifiedClassName(this) + " (" + this.m00.toFixed(3) + " " + this.m01.toFixed(3) + " " + this.m02.toFixed(3) + " " + this.m03.toFixed(3) + "] [" + this.m10.toFixed(3) + " " + this.m11.toFixed(3) + " " + this.m12.toFixed(3) + " " + this.m13.toFixed(3) + "] [" + this.m20.toFixed(3) + " " + this.m21.toFixed(3) + " " + this.m22.toFixed(3) + " " + this.m23.toFixed(3) + ")";
    }

    public fromAxisAngle(param1: Vector3d, param2: number): void {
        var _loc3_: number = Math.cos(param2);
        var _loc4_: number = Math.sin(param2);
        var _loc5_: number = 1 - _loc3_;
        var _loc6_: number = param1.x;
        var _loc7_: number = param1.y;
        var _loc8_: number = param1.z;
        this.m00 = _loc5_ * _loc6_ * _loc6_ + _loc3_;
        this.m01 = _loc5_ * _loc6_ * _loc7_ - _loc8_ * _loc4_;
        this.m02 = _loc5_ * _loc6_ * _loc8_ + _loc7_ * _loc4_;
        this.m10 = _loc5_ * _loc6_ * _loc7_ + _loc8_ * _loc4_;
        this.m11 = _loc5_ * _loc7_ * _loc7_ + _loc3_;
        this.m12 = _loc5_ * _loc7_ * _loc8_ - _loc6_ * _loc4_;
        this.m20 = _loc5_ * _loc6_ * _loc8_ - _loc7_ * _loc4_;
        this.m21 = _loc5_ * _loc7_ * _loc8_ + _loc6_ * _loc4_;
        this.m22 = _loc5_ * _loc8_ * _loc8_ + _loc3_;
    }

    // public setFromMatrix3D(param1: Matrix3D): void {
    //     var _loc2_: number[] = param1.rawData;
    //     this.init(_loc2_[0], _loc2_[4], _loc2_[8], _loc2_[12], _loc2_[1], _loc2_[5], _loc2_[9], _loc2_[13], _loc2_[2], _loc2_[6], _loc2_[10], _loc2_[14]);
    // }
}