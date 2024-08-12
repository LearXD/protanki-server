import { Vector3d } from "@/utils/vector-3d";

export class Matrix3 {

    public static readonly ZERO: Matrix3 = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);

    public static readonly IDENTITY: Matrix3 = new Matrix3();

    private static vec0: Vector3d = new Vector3d();

    private static vec1: Vector3d = new Vector3d();

    private static vec2: Vector3d = new Vector3d();

    public m00: number;

    public m01: number;

    public m02: number;

    public m10: number;

    public m11: number;

    public m12: number;

    public m20: number;

    public m21: number;

    public m22: number;

    public constructor(param1: number = 1, param2: number = 0, param3: number = 0, param4: number = 0, param5: number = 1, param6: number = 0, param7: number = 0, param8: number = 0, param9: number = 1) {
        //  super();
        this.m00 = param1;
        this.m01 = param2;
        this.m02 = param3;
        this.m10 = param4;
        this.m11 = param5;
        this.m12 = param6;
        this.m20 = param7;
        this.m21 = param8;
        this.m22 = param9;
    }

    public toIdentity(): Matrix3 {
        this.m00 = this.m11 = this.m22 = 1;
        this.m01 = this.m02 = this.m10 = this.m12 = this.m20 = this.m21 = 0;
        return this;
    }

    public invert(): Matrix3 {
        let _loc1_: number = this.m00;
        let _loc2_: number = this.m01;
        let _loc3_: number = this.m02;
        let _loc4_: number = this.m10;
        let _loc5_: number = this.m11;
        let _loc6_: number = this.m12;
        let _loc7_: number = this.m20;
        let _loc8_: number = this.m21;
        let _loc9_: number = this.m22;
        let _loc10_: number = 1 / (-_loc3_ * _loc5_ * _loc7_ + _loc2_ * _loc6_ * _loc7_ + _loc3_ * _loc4_ * _loc8_ - _loc1_ * _loc6_ * _loc8_ - _loc2_ * _loc4_ * _loc9_ + _loc1_ * _loc5_ * _loc9_);
        this.m00 = (_loc5_ * _loc9_ - _loc6_ * _loc8_) * _loc10_;
        this.m01 = (_loc3_ * _loc8_ - _loc2_ * _loc9_) * _loc10_;
        this.m02 = (_loc2_ * _loc6_ - _loc3_ * _loc5_) * _loc10_;
        this.m10 = (_loc6_ * _loc7_ - _loc4_ * _loc9_) * _loc10_;
        this.m11 = (_loc1_ * _loc9_ - _loc3_ * _loc7_) * _loc10_;
        this.m12 = (_loc3_ * _loc4_ - _loc1_ * _loc6_) * _loc10_;
        this.m20 = (_loc4_ * _loc8_ - _loc5_ * _loc7_) * _loc10_;
        this.m21 = (_loc2_ * _loc7_ - _loc1_ * _loc8_) * _loc10_;
        this.m22 = (_loc1_ * _loc5_ - _loc2_ * _loc4_) * _loc10_;
        return this;
    }

    public append(param1: Matrix3): Matrix3 {
        let _loc2_: number = this.m00;
        let _loc3_: number = this.m01;
        let _loc4_: number = this.m02;
        let _loc5_: number = this.m10;
        let _loc6_: number = this.m11;
        let _loc7_: number = this.m12;
        let _loc8_: number = this.m20;
        let _loc9_: number = this.m21;
        let _loc10_: number = this.m22;
        this.m00 = param1.m00 * _loc2_ + param1.m01 * _loc5_ + param1.m02 * _loc8_;
        this.m01 = param1.m00 * _loc3_ + param1.m01 * _loc6_ + param1.m02 * _loc9_;
        this.m02 = param1.m00 * _loc4_ + param1.m01 * _loc7_ + param1.m02 * _loc10_;
        this.m10 = param1.m10 * _loc2_ + param1.m11 * _loc5_ + param1.m12 * _loc8_;
        this.m11 = param1.m10 * _loc3_ + param1.m11 * _loc6_ + param1.m12 * _loc9_;
        this.m12 = param1.m10 * _loc4_ + param1.m11 * _loc7_ + param1.m12 * _loc10_;
        this.m20 = param1.m20 * _loc2_ + param1.m21 * _loc5_ + param1.m22 * _loc8_;
        this.m21 = param1.m20 * _loc3_ + param1.m21 * _loc6_ + param1.m22 * _loc9_;
        this.m22 = param1.m20 * _loc4_ + param1.m21 * _loc7_ + param1.m22 * _loc10_;
        return this;
    }

    public prepend(param1: Matrix3): Matrix3 {
        let _loc2_: number = this.m00;
        let _loc3_: number = this.m01;
        let _loc4_: number = this.m02;
        let _loc5_: number = this.m10;
        let _loc6_: number = this.m11;
        let _loc7_: number = this.m12;
        let _loc8_: number = this.m20;
        let _loc9_: number = this.m21;
        let _loc10_: number = this.m22;
        this.m00 = _loc2_ * param1.m00 + _loc3_ * param1.m10 + _loc4_ * param1.m20;
        this.m01 = _loc2_ * param1.m01 + _loc3_ * param1.m11 + _loc4_ * param1.m21;
        this.m02 = _loc2_ * param1.m02 + _loc3_ * param1.m12 + _loc4_ * param1.m22;
        this.m10 = _loc5_ * param1.m00 + _loc6_ * param1.m10 + _loc7_ * param1.m20;
        this.m11 = _loc5_ * param1.m01 + _loc6_ * param1.m11 + _loc7_ * param1.m21;
        this.m12 = _loc5_ * param1.m02 + _loc6_ * param1.m12 + _loc7_ * param1.m22;
        this.m20 = _loc8_ * param1.m00 + _loc9_ * param1.m10 + _loc10_ * param1.m20;
        this.m21 = _loc8_ * param1.m01 + _loc9_ * param1.m11 + _loc10_ * param1.m21;
        this.m22 = _loc8_ * param1.m02 + _loc9_ * param1.m12 + _loc10_ * param1.m22;
        return this;
    }

    public prependTransposed(param1: Matrix3): Matrix3 {
        let _loc2_: number = this.m00;
        let _loc3_: number = this.m01;
        let _loc4_: number = this.m02;
        let _loc5_: number = this.m10;
        let _loc6_: number = this.m11;
        let _loc7_: number = this.m12;
        let _loc8_: number = this.m20;
        let _loc9_: number = this.m21;
        let _loc10_: number = this.m22;
        this.m00 = _loc2_ * param1.m00 + _loc3_ * param1.m01 + _loc4_ * param1.m02;
        this.m01 = _loc2_ * param1.m10 + _loc3_ * param1.m11 + _loc4_ * param1.m12;
        this.m02 = _loc2_ * param1.m20 + _loc3_ * param1.m21 + _loc4_ * param1.m22;
        this.m10 = _loc5_ * param1.m00 + _loc6_ * param1.m01 + _loc7_ * param1.m02;
        this.m11 = _loc5_ * param1.m10 + _loc6_ * param1.m11 + _loc7_ * param1.m12;
        this.m12 = _loc5_ * param1.m20 + _loc6_ * param1.m21 + _loc7_ * param1.m22;
        this.m20 = _loc8_ * param1.m00 + _loc9_ * param1.m01 + _loc10_ * param1.m02;
        this.m21 = _loc8_ * param1.m10 + _loc9_ * param1.m11 + _loc10_ * param1.m12;
        this.m22 = _loc8_ * param1.m20 + _loc9_ * param1.m21 + _loc10_ * param1.m22;
        return this;
    }

    public add(param1: Matrix3): Matrix3 {
        this.m00 += param1.m00;
        this.m01 += param1.m01;
        this.m02 += param1.m02;
        this.m10 += param1.m10;
        this.m11 += param1.m11;
        this.m12 += param1.m12;
        this.m20 += param1.m20;
        this.m21 += param1.m21;
        this.m22 += param1.m22;
        return this;
    }

    public subtract(param1: Matrix3): Matrix3 {
        this.m00 -= param1.m00;
        this.m01 -= param1.m01;
        this.m02 -= param1.m02;
        this.m10 -= param1.m10;
        this.m11 -= param1.m11;
        this.m12 -= param1.m12;
        this.m20 -= param1.m20;
        this.m21 -= param1.m21;
        this.m22 -= param1.m22;
        return this;
    }

    public transpose(): Matrix3 {
        let _loc1_: number = this.m01;
        this.m01 = this.m10;
        this.m10 = _loc1_;
        _loc1_ = this.m02;
        this.m02 = this.m20;
        this.m20 = _loc1_;
        _loc1_ = this.m12;
        this.m12 = this.m21;
        this.m21 = _loc1_;
        return this;
    }

    public transformVector(param1: Vector3d, param2: Vector3d): void {
        param2.x = this.m00 * param1.x + this.m01 * param1.y + this.m02 * param1.z;
        param2.y = this.m10 * param1.x + this.m11 * param1.y + this.m12 * param1.z;
        param2.z = this.m20 * param1.x + this.m21 * param1.y + this.m22 * param1.z;
    }

    public transformVectorInverse(param1: Vector3d, param2: Vector3d): void {
        param2.x = this.m00 * param1.x + this.m10 * param1.y + this.m20 * param1.z;
        param2.y = this.m01 * param1.x + this.m11 * param1.y + this.m21 * param1.z;
        param2.z = this.m02 * param1.x + this.m12 * param1.y + this.m22 * param1.z;
    }

    public transformVector3To3D(param1: Vector3d, param2: any/*Vector3D*/): void {
        param2.x = this.m00 * param1.x + this.m01 * param1.y + this.m02 * param1.z;
        param2.y = this.m10 * param1.x + this.m11 * param1.y + this.m12 * param1.z;
        param2.z = this.m20 * param1.x + this.m21 * param1.y + this.m22 * param1.z;
    }

    public createSkewSymmetric(param1: Vector3d): Matrix3 {
        this.m00 = this.m11 = this.m22 = 0;
        this.m01 = -param1.z;
        this.m02 = param1.y;
        this.m10 = param1.z;
        this.m12 = -param1.x;
        this.m20 = -param1.y;
        this.m21 = param1.x;
        return this;
    }

    public copy(param1: Matrix3): Matrix3 {
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

    public setRotationMatrix(param1: number, param2: number, param3: number): Matrix3 {
        let _loc4_: number = Math.cos(param1);
        let _loc5_: number = Math.sin(param1);
        let _loc6_: number = Math.cos(param2);
        let _loc7_: number = Math.sin(param2);
        let _loc8_: number = Math.cos(param3);
        let _loc9_: number = Math.sin(param3);
        let _loc10_: number = _loc8_ * _loc7_;
        let _loc11_: number = _loc9_ * _loc7_;
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

    public setRotationMatrixForObject3D(param1: any/*Object3D*/): void {
        this.setRotationMatrix(param1.rotationX, param1.rotationY, param1.rotationZ);
    }

    public fromAxisAngle(param1: Vector3d, param2: number): void {
        let _loc3_: number = Math.cos(param2);
        let _loc4_: number = Math.sin(param2);
        let _loc5_: number = 1 - _loc3_;
        let _loc6_: number = param1.x;
        let _loc7_: number = param1.y;
        let _loc8_: number = param1.z;
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

    public clone(): Matrix3 {
        return new Matrix3(this.m00, this.m01, this.m02, this.m10, this.m11, this.m12, this.m20, this.m21, this.m22);
    }

    public toString(): String {
        return "Matrix3 (" + this.m00 + ", " + this.m01 + ", " + this.m02 + "), (" + this.m10 + ", " + this.m11 + ", " + this.m12 + "), (" + this.m20 + ", " + this.m21 + ", " + this.m22 + ")";
        // return getQualifiedClassName(this) + " (" + this.m00 + ", " + this.m01 + ", " + this.m02 + "), (" + this.m10 + ", " + this.m11 + ", " + this.m12 + "), (" + this.m20 + ", " + this.m21 + ", " + this.m22 + ")";
    }

    public getEulerAngles(param1: Vector3d): void {
        if (-1 < this.m20 && this.m20 < 1) {
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

    public slaDoMatrix4(param1: Vector3d): void {
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
                param2.reset(this.m00, this.m10, this.m20);
                break;
            case 1:
                param2.reset(this.m01, this.m11, this.m21);
                break;
            case 2:
                param2.reset(this.m02, this.m12, this.m22);
        }
    }

    public sla1Matrix3(param1: Vector3d): void {
        Matrix3.vec1.copy(param1).normalize();
        if (Matrix3.vec1.dot(Vector3d.X_AXIS) < 0.9) {
            Matrix3.vec2.cross2(Vector3d.X_AXIS, Matrix3.vec1);
        }
        else {
            Matrix3.vec2.cross2(Matrix3.vec1, Vector3d.Y_AXIS);
        }
        Matrix3.vec2.normalize();
        Matrix3.vec0.cross2(Matrix3.vec1, Matrix3.vec2).normalize();
        this.sla2Matrix3(Matrix3.vec0, Matrix3.vec1, Matrix3.vec2);
    }

    public sla2Matrix3(param1: Vector3d, param2: Vector3d, param3: Vector3d): void {
        this.m00 = param1.x;
        this.m01 = param2.x;
        this.m02 = param3.x;
        this.m10 = param1.y;
        this.m11 = param2.y;
        this.m12 = param3.y;
        this.m20 = param1.z;
        this.m21 = param2.z;
        this.m22 = param3.z;
    }
}
