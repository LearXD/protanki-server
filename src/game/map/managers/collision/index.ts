import { Vector3d } from "@/utils/vector-3d";
import { ICollisionObject, IMapCollisions } from "./types";
import { Logger } from "@/utils/logger";
import { Range } from "@/utils/range";
import { CollisionRect } from "./collisions/rect";
import { CollisionShape } from "./collisions/shape";
import { Matrix3 } from "./utils/matrix-3";
import { CollisionKdTree } from "./utils/collision-kd-tree";
import { RayHit } from "./utils/rayhit";
import { AABB } from "./utils/aabb";
import { CollisionKdNode } from "./utils/collision-kd-node";
import { CollisionBox } from "./collisions/box";
import { CollisionTriangle } from "./collisions/triangle";


export class MapCollisionManager {

    public collisions: CollisionShape[] = []
    public tree = new CollisionKdTree()

    private threshold: number = 0.0001;

    public vec1: Vector3d = new Vector3d();
    public vec2: Vector3d = new Vector3d();

    public range1: Range = new Range();

    public constructor(
        public readonly data: IMapCollisions
    ) {
        this.loadRects()
        this.loadBoxes()
        this.loadTriangles()

        this.tree.createTree(this.collisions);
    }

    public loadRects(): void {
        for (const rect of this.data.planes) {
            const size = new Vector3d()
            size.x = 0.5 * (rect.width);
            size.y = 0.5 * (rect.length);
            size.z = 0;
            const _loc3_ = new CollisionRect(size, 255, null);
            MapCollisionManager.parsePosition(_loc3_, rect);
            this.collisions.push(_loc3_);
        }
    }

    public loadBoxes(): void {
        for (const box of this.data.boxes) {
            const size = new Vector3d(box.size.x, box.size.y, box.size.z)
            size.scale(0.5)
            const _loc3_ = new CollisionBox(size, 255, null)
            MapCollisionManager.parsePosition(_loc3_, box);
            this.collisions.push(_loc3_);
        }
    }

    public loadTriangles(): void {
        for (const triangle of this.data.triangles) {
            const [a, b, c] = triangle.vertices
            const v1 = new Vector3d(a.x, a.y, a.z)
            const v2 = new Vector3d(b.x, b.y, b.z)
            const v3 = new Vector3d(c.x, c.y, c.z)
            const _loc3_ = new CollisionTriangle(v1, v2, v3, 255, null)
            MapCollisionManager.parsePosition(_loc3_, triangle);
            this.collisions.push(_loc3_);
        }
    }

    public static parsePosition(shape: CollisionShape, object: ICollisionObject) {
        const position = new Vector3d(object.position.x, object.position.y, object.position.z)
        const rotation = new Vector3d(object.rotation.x, object.rotation.y, object.rotation.z)
        const matrix = new Matrix3()
        matrix.setRotationMatrix(rotation.x, rotation.y, rotation.z)
        shape.transform.setFromMatrix3(matrix, position)
    }

    public raycastStatic(param1: Vector3d, param2: Vector3d, param3: number, param4: number, param5: any/*IRayCollisionFilter*/, param6: RayHit): boolean {
        if (!this.__raycastStatic1(param1, param2, this.tree.rootNode.boundBox, this.range1)) {
            return false;
        }
        if (this.range1.max < 0 || this.range1.min > param4) {
            return false;
        }
        if (this.range1.min <= 0) {
            this.range1.min = 0;
            this.vec2.x = param1.x;
            this.vec2.y = param1.y;
            this.vec2.z = param1.z;
        }
        else {
            this.vec2.x = param1.x + this.range1.min * param2.x;
            this.vec2.y = param1.y + this.range1.min * param2.y;
            this.vec2.z = param1.z + this.range1.min * param2.z;
        }
        if (this.range1.max > param4) {
            this.range1.max = param4;
        }
        var _loc7_: boolean;
        return (_loc7_ = this.__raycastStatic2(this.tree.rootNode, param1, this.vec2, param2, param3, this.range1.min, this.range1.max, param5, param6)) ? param6.t <= param4 : false;
    }

    private __raycastStatic1(param1: Vector3d, param2: Vector3d, param3: AABB, param4: Range): boolean {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        param4.min = -1;
        param4.max = 1e+308;
        var _loc7_: number = 0;
        for (; _loc7_ < 3; _loc7_++) {
            switch (_loc7_) {
                case 0:
                    if (!(param2.x < this.threshold && param2.x > -this.threshold)) {
                        _loc5_ = (param3.minX - param1.x) / param2.x;
                        _loc6_ = (param3.maxX - param1.x) / param2.x;
                        break;
                    }
                    if (param1.x < param3.minX || param1.x > param3.maxX) {
                        return false;
                    }
                    continue;
                case 1:
                    if (!(param2.y < this.threshold && param2.y > -this.threshold)) {
                        _loc5_ = (param3.minY - param1.y) / param2.y;
                        _loc6_ = (param3.maxY - param1.y) / param2.y;
                        break;
                    }
                    if (param1.y < param3.minY || param1.y > param3.maxY) {
                        return false;
                    }
                    continue;
                case 2:
                    if (!(param2.z < this.threshold && param2.z > -this.threshold)) {
                        _loc5_ = (param3.minZ - param1.z) / param2.z;
                        _loc6_ = (param3.maxZ - param1.z) / param2.z;
                        break;
                    }
                    if (param1.z < param3.minZ || param1.z > param3.maxZ) {
                        return false;
                    }
                    continue;
            }
            if (_loc5_ < _loc6_) {
                if (_loc5_ > param4.min) {
                    param4.min = _loc5_;
                }
                if (_loc6_ < param4.max) {
                    param4.max = _loc6_;
                }
            }
            else {
                if (_loc6_ > param4.min) {
                    param4.min = _loc6_;
                }
                if (_loc5_ < param4.max) {
                    param4.max = _loc5_;
                }
            }
            if (param4.max < param4.min) {
                return false;
            }
        }
        return true;
    }

    private __raycastStatic2(
        param1: CollisionKdNode,
        param2: Vector3d,
        param3: Vector3d,
        param4: Vector3d,
        param5: number,
        param6: number,
        param7: number,
        param8: any,//IRayCollisionFilter, 
        param9: RayHit
    ): boolean {
        var _loc10_: number = NaN;
        var _loc11_: CollisionKdNode = null;
        var _loc12_: boolean = false;
        var _loc13_: CollisionKdNode = null;
        var _loc14_: number = 0;
        var _loc15_: number = 0;
        var _loc16_: CollisionShape = null;
        if (param1.indices != null && this.__raycastStatic3(param2, param4, param5, this.tree.staticChildren, param1.indices, param8, param9)) {
            return true;
        }
        if (param1.axis == -1) {
            return false;
        }
        switch (param1.axis) {
            case 0:
                if (param4.x > -this.threshold && param4.x < this.threshold) {
                    _loc10_ = param7 + 1;
                }
                else {
                    _loc10_ = (param1.coord - param2.x) / param4.x;
                }
                _loc11_ = param3.x < param1.coord ? param1.negativeNode : param1.positiveNode;
                break;
            case 1:
                if (param4.y > -this.threshold && param4.y < this.threshold) {
                    _loc10_ = param7 + 1;
                }
                else {
                    _loc10_ = (param1.coord - param2.y) / param4.y;
                }
                _loc11_ = param3.y < param1.coord ? param1.negativeNode : param1.positiveNode;
                break;
            case 2:
                if (param4.z > -this.threshold && param4.z < this.threshold) {
                    _loc10_ = param7 + 1;
                }
                else {
                    _loc10_ = (param1.coord - param2.z) / param4.z;
                }
                _loc11_ = param3.z < param1.coord ? param1.negativeNode : param1.positiveNode;
        }
        if (_loc10_ < param6 || _loc10_ > param7) {
            return this.__raycastStatic2(_loc11_, param2, param3, param4, param5, param6, param7, param8, param9);
        }
        if (_loc12_ = this.__raycastStatic2(_loc11_, param2, param3, param4, param5, param6, _loc10_, param8, param9)) {
            return true;
        }
        this.vec2.x = param2.x + _loc10_ * param4.x;
        this.vec2.y = param2.y + _loc10_ * param4.y;
        this.vec2.z = param2.z + _loc10_ * param4.z;
        if (param1.splitTree != null) {
            _loc13_ = param1.splitTree.rootNode;
            while (_loc13_ != null && _loc13_.axis != -1) {
                switch (_loc13_.axis) {
                    case 0:
                        _loc13_ = this.vec2.x < _loc13_.coord ? _loc13_.negativeNode : _loc13_.positiveNode;
                        break;
                    case 1:
                        _loc13_ = this.vec2.y < _loc13_.coord ? _loc13_.negativeNode : _loc13_.positiveNode;
                        break;
                    case 2:
                        _loc13_ = this.vec2.z < _loc13_.coord ? _loc13_.negativeNode : _loc13_.positiveNode;
                        break;
                }
            }
            if (_loc13_ != null && _loc13_.indices != null) {
                _loc14_ = (_loc13_.indices.length);
                _loc15_ = 0;
                while (_loc15_ < _loc14_) {
                    if (((_loc16_ = this.tree.staticChildren[_loc13_.indices[_loc15_]]).collisionGroup & param5) != 0) {
                        if (!(param8 != null && !param8.considerBody(_loc16_.body))) {
                            param9.t = _loc16_.raycast(param2, param4, this.threshold, param9.normal);
                            if (param9.t >= 0) {
                                param9.position.copy(this.vec2);
                                param9.shape = _loc16_;
                                return true;
                            }
                        }
                    }
                    _loc15_++;
                }
            }
        }
        return this.__raycastStatic2(_loc11_ == param1.negativeNode ? param1.positiveNode : param1.negativeNode, param2, this.vec2, param4, param5, _loc10_, param7, param8, param9);
    }

    private __raycastStatic3(param1: Vector3d, param2: Vector3d, param3: number, param4: CollisionShape[], param5: number[], param6: any/*IRayCollisionFilter*/, param7: RayHit): boolean {
        var _loc8_: CollisionShape = null;
        var _loc9_: number = NaN;
        var _loc10_: number = (param5.length);
        var _loc11_: number = 1e+308;
        var _loc12_: number = 0;
        while (_loc12_ < _loc10_) {
            if (((_loc8_ = param4[param5[_loc12_]]).collisionGroup & param3) != 0) {
                if (!(param6 != null && !param6.considerBody(_loc8_.body))) {
                    if ((_loc9_ = _loc8_.raycast(param1, param2, this.threshold, this.vec1)) > 0 && _loc9_ < _loc11_) {
                        _loc11_ = _loc9_;
                        param7.shape = _loc8_;
                        param7.normal.x = this.vec1.x;
                        param7.normal.y = this.vec1.y;
                        param7.normal.z = this.vec1.z;
                    }
                }
            }
            _loc12_++;
        }
        if (_loc11_ == 1e+308) {
            return false;
        }
        param7.position.x = param1.x + param2.x * _loc11_;
        param7.position.y = param1.y + param2.y * _loc11_;
        param7.position.z = param1.z + param2.z * _loc11_;
        param7.t = _loc11_;
        return true;
    }
}