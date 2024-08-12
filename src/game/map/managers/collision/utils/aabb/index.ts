

export class AABB {

    public minX: number = 1e+308;
    public minY: number = 1e+308;
    public minZ: number = 1e+308;
    public maxX: number = -1e+308;
    public maxY: number = -1e+308;
    public maxZ: number = -1e+308;

    public setSize(param1: number, param2: number, param3: number, param4: number, param5: number, param6: number): void {
        this.minX = param1;
        this.minY = param2;
        this.minZ = param3;
        this.maxX = param4;
        this.maxY = param5;
        this.maxZ = param6;
    }

    public addBoundBox(param1: AABB): void {
        this.minX = param1.minX < this.minX ? param1.minX : this.minX;
        this.minY = param1.minY < this.minY ? param1.minY : this.minY;
        this.minZ = param1.minZ < this.minZ ? param1.minZ : this.minZ;
        this.maxX = param1.maxX > this.maxX ? param1.maxX : this.maxX;
        this.maxY = param1.maxY > this.maxY ? param1.maxY : this.maxY;
        this.maxZ = param1.maxZ > this.maxZ ? param1.maxZ : this.maxZ;
    }

    public addPoint(param1: number, param2: number, param3: number): void {
        if (param1 < this.minX) {
            this.minX = param1;
        }
        if (param1 > this.maxX) {
            this.maxX = param1;
        }
        if (param2 < this.minY) {
            this.minY = param2;
        }
        if (param2 > this.maxY) {
            this.maxY = param2;
        }
        if (param3 < this.minZ) {
            this.minZ = param3;
        }
        if (param3 > this.maxZ) {
            this.maxZ = param3;
        }
    }

    public infinity(): void {
        this.minX = 1e+308;
        this.minY = 1e+308;
        this.minZ = 1e+308;
        this.maxX = -1e+308;
        this.maxY = -1e+308;
        this.maxZ = -1e+308;
    }

    public intersects(param1: AABB, param2: number): boolean {
        return !(this.minX > param1.maxX + param2 || this.maxX < param1.minX - param2 || this.minY > param1.maxY + param2 || this.maxY < param1.minY - param2 || this.minZ > param1.maxZ + param2 || this.maxZ < param1.minZ - param2);
    }

    public copyFrom(param1: AABB): void {
        this.minX = param1.minX;
        this.minY = param1.minY;
        this.minZ = param1.minZ;
        this.maxX = param1.maxX;
        this.maxY = param1.maxY;
        this.maxZ = param1.maxZ;
    }

    public clone(): AABB {
        const _loc1_: AABB = new AABB();
        _loc1_.copyFrom(this);
        return _loc1_;
    }

    public getSizeX(): number {
        return this.maxX - this.minX;
    }

    public getSizeY(): number {
        return this.maxY - this.minY;
    }

    public getSizeZ(): number {
        return this.maxZ - this.minZ;
    }

    public toString(): String {
        return "AABB(" + this.minX.toFixed(3) + ", " + this.minY.toFixed(3) + ", " + this.minZ.toFixed(3) + ": " + this.maxX.toFixed(3) + ", " + this.maxY.toFixed(3) + ", " + this.maxZ.toFixed(3) + ")";
        // return getQualifiedClassName(this) + "(" + this.minX.toFixed(3) + ", " + this.minY.toFixed(3) + ", " + this.minZ.toFixed(3) + ": " + this.maxX.toFixed(3) + ", " + this.maxY.toFixed(3) + ", " + this.maxZ.toFixed(3) + ")";
    }
}
