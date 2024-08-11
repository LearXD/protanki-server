import { AABB } from "@/utils/aabb";
import { CollisionShape } from "../../collisions/shape";
import { CollisionKdNode } from "../collision-kd-node";
import { CollisionKdTree2D } from "../collision-kd-tree-2d";

export class CollisionKdTree {

    private static readonly nodeBoundBoxThreshold: AABB = new AABB();

    private static readonly splitCoordsX: number[] = [];

    private static readonly splitCoordsY: number[] = [];

    private static readonly splitCoordsZ: number[] = [];

    private static readonly _nodeBB: number[] = Array.from({ length: 6 }, () => 0);

    private static readonly _bb: number[] = Array.from({ length: 6 }, () => 0);


    public threshold: number = 0.1;

    public minPrimitivesPerNode: number = 1;

    public rootNode: CollisionKdNode;

    public staticChildren: CollisionShape[];

    public numStaticChildren: number;

    public staticBoundBoxes: AABB[];

    private splitAxis: number;

    private splitCoord: number;

    private splitCost: number;

    public constructor() {
        this.staticBoundBoxes = [];
        //   super();
    }

    public createTree(param1: CollisionShape[], param2: AABB = null): void {
        var _loc3_: CollisionShape = null;
        var _loc4_: AABB = null;
        this.staticChildren = param1.concat();
        this.numStaticChildren = this.staticChildren.length;
        this.rootNode = new CollisionKdNode();
        this.rootNode.indices = [];
        var _loc5_: AABB = this.rootNode.boundBox = param2 != null ? param2 : new AABB();
        var _loc6_: number = 0;
        while (_loc6_ < this.numStaticChildren) {
            _loc3_ = this.staticChildren[_loc6_];
            _loc4_ = this.staticBoundBoxes[_loc6_] = _loc3_.calculateAABB();
            _loc5_.addBoundBox(_loc4_);
            this.rootNode.indices[_loc6_] = _loc6_;
            _loc6_++;
        }
        this.staticBoundBoxes.length = this.numStaticChildren;
        this.splitNode(this.rootNode);
        CollisionKdTree.splitCoordsX.length = CollisionKdTree.splitCoordsY.length = CollisionKdTree.splitCoordsZ.length = 0;
    }

    private splitNode(param1: CollisionKdNode): void {
        var _loc2_: AABB = null;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        var _loc5_: AABB = null;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc9_: number;
        var _loc8_: number[];
        if ((_loc9_ = (_loc8_ = param1.indices).length) <= this.minPrimitivesPerNode) {
            return;
        }
        _loc2_ = param1.boundBox;
        CollisionKdTree.nodeBoundBoxThreshold.minX = _loc2_.minX + this.threshold;
        CollisionKdTree.nodeBoundBoxThreshold.minY = _loc2_.minY + this.threshold;
        CollisionKdTree.nodeBoundBoxThreshold.minZ = _loc2_.minZ + this.threshold;
        CollisionKdTree.nodeBoundBoxThreshold.maxX = _loc2_.maxX - this.threshold;
        CollisionKdTree.nodeBoundBoxThreshold.maxY = _loc2_.maxY - this.threshold;
        CollisionKdTree.nodeBoundBoxThreshold.maxZ = _loc2_.maxZ - this.threshold;
        var _loc10_: number = this.threshold * 2;
        var _loc11_: number = 0;
        var _loc12_: number = 0;
        var _loc13_: number = 0;
        _loc3_ = 0;
        while (_loc3_ < _loc9_) {
            if ((_loc5_ = this.staticBoundBoxes[_loc8_[_loc3_]]).maxX - _loc5_.minX <= _loc10_) {
                if (_loc5_.minX <= CollisionKdTree.nodeBoundBoxThreshold.minX) {
                    var _loc18_: any;
                    CollisionKdTree.splitCoordsX[_loc18_ = _loc11_++] = _loc2_.minX;
                }
                else if (_loc5_.maxX >= CollisionKdTree.nodeBoundBoxThreshold.maxX) {
                    CollisionKdTree.splitCoordsX[_loc18_ = _loc11_++] = _loc2_.maxX;
                }
                else {
                    CollisionKdTree.splitCoordsX[_loc18_ = _loc11_++] = (_loc5_.minX + _loc5_.maxX) * 0.5;
                }
            }
            else {
                if (_loc5_.minX > CollisionKdTree.nodeBoundBoxThreshold.minX) {
                    CollisionKdTree.splitCoordsX[_loc18_ = _loc11_++] = _loc5_.minX;
                }
                if (_loc5_.maxX < CollisionKdTree.nodeBoundBoxThreshold.maxX) {
                    CollisionKdTree.splitCoordsX[_loc18_ = _loc11_++] = _loc5_.maxX;
                }
            }
            if (_loc5_.maxY - _loc5_.minY <= _loc10_) {
                if (_loc5_.minY <= CollisionKdTree.nodeBoundBoxThreshold.minY) {
                    CollisionKdTree.splitCoordsY[_loc18_ = _loc12_++] = _loc2_.minY;
                }
                else if (_loc5_.maxY >= CollisionKdTree.nodeBoundBoxThreshold.maxY) {
                    CollisionKdTree.splitCoordsY[_loc18_ = _loc12_++] = _loc2_.maxY;
                }
                else {
                    CollisionKdTree.splitCoordsY[_loc18_ = _loc12_++] = (_loc5_.minY + _loc5_.maxY) * 0.5;
                }
            }
            else {
                if (_loc5_.minY > CollisionKdTree.nodeBoundBoxThreshold.minY) {
                    CollisionKdTree.splitCoordsY[_loc18_ = _loc12_++] = _loc5_.minY;
                }
                if (_loc5_.maxY < CollisionKdTree.nodeBoundBoxThreshold.maxY) {
                    CollisionKdTree.splitCoordsY[_loc18_ = _loc12_++] = _loc5_.maxY;
                }
            }
            if (_loc5_.maxZ - _loc5_.minZ <= _loc10_) {
                if (_loc5_.minZ <= CollisionKdTree.nodeBoundBoxThreshold.minZ) {
                    CollisionKdTree.splitCoordsZ[_loc18_ = _loc13_++] = _loc2_.minZ;
                }
                else if (_loc5_.maxZ >= CollisionKdTree.nodeBoundBoxThreshold.maxZ) {
                    CollisionKdTree.splitCoordsZ[_loc18_ = _loc13_++] = _loc2_.maxZ;
                }
                else {
                    CollisionKdTree.splitCoordsZ[_loc18_ = _loc13_++] = (_loc5_.minZ + _loc5_.maxZ) * 0.5;
                }
            }
            else {
                if (_loc5_.minZ > CollisionKdTree.nodeBoundBoxThreshold.minZ) {
                    CollisionKdTree.splitCoordsZ[_loc18_ = _loc13_++] = _loc5_.minZ;
                }
                if (_loc5_.maxZ < CollisionKdTree.nodeBoundBoxThreshold.maxZ) {
                    CollisionKdTree.splitCoordsZ[_loc18_ = _loc13_++] = _loc5_.maxZ;
                }
            }
            _loc3_++;
        }
        this.splitAxis = -1;
        this.splitCost = 1e+308;
        CollisionKdTree._nodeBB[0] = _loc2_.minX;
        CollisionKdTree._nodeBB[1] = _loc2_.minY;
        CollisionKdTree._nodeBB[2] = _loc2_.minZ;
        CollisionKdTree._nodeBB[3] = _loc2_.maxX;
        CollisionKdTree._nodeBB[4] = _loc2_.maxY;
        CollisionKdTree._nodeBB[5] = _loc2_.maxZ;
        this.checkNodeAxis(param1, 0, _loc11_, CollisionKdTree.splitCoordsX, CollisionKdTree._nodeBB);
        this.checkNodeAxis(param1, 1, _loc12_, CollisionKdTree.splitCoordsY, CollisionKdTree._nodeBB);
        this.checkNodeAxis(param1, 2, _loc13_, CollisionKdTree.splitCoordsZ, CollisionKdTree._nodeBB);
        if (this.splitAxis < 0) {
            return;
        }
        var _loc14_: any = this.splitAxis == 0;
        var _loc15_: any = this.splitAxis == 1;
        param1.axis = this.splitAxis;
        param1.coord = this.splitCoord;
        param1.negativeNode = new CollisionKdNode();
        param1.negativeNode.parent = param1;
        param1.negativeNode.boundBox = _loc2_.clone();
        param1.positiveNode = new CollisionKdNode();
        param1.positiveNode.parent = param1;
        param1.positiveNode.boundBox = _loc2_.clone();
        if (_loc14_) {
            param1.negativeNode.boundBox.maxX = param1.positiveNode.boundBox.minX = this.splitCoord;
        }
        else if (_loc15_) {
            param1.negativeNode.boundBox.maxY = param1.positiveNode.boundBox.minY = this.splitCoord;
        }
        else {
            param1.negativeNode.boundBox.maxZ = param1.positiveNode.boundBox.minZ = this.splitCoord;
        }
        var _loc16_: number = this.splitCoord - this.threshold;
        var _loc17_: number = this.splitCoord + this.threshold;
        _loc3_ = 0;
        while (_loc3_ < _loc9_) {
            _loc5_ = this.staticBoundBoxes[_loc8_[_loc3_]];
            _loc6_ = _loc14_ ? _loc5_.minX : (_loc15_ ? _loc5_.minY : _loc5_.minZ);
            if ((_loc7_ = _loc14_ ? _loc5_.maxX : (_loc15_ ? _loc5_.maxY : _loc5_.maxZ)) <= _loc17_) {
                if (_loc6_ < _loc16_) {
                    if (param1.negativeNode.indices == null) {
                        param1.negativeNode.indices = [];
                    }
                    param1.negativeNode.indices.push(_loc8_[_loc3_]);
                    _loc8_[_loc3_] = -1;
                }
                else {
                    if (param1.splitIndices == null) {
                        param1.splitIndices = []
                    }
                    param1.splitIndices.push(_loc8_[_loc3_]);
                    _loc8_[_loc3_] = -1;
                }
            }
            else if (_loc6_ >= _loc16_) {
                if (param1.positiveNode.indices == null) {
                    param1.positiveNode.indices = [];
                }
                param1.positiveNode.indices.push(_loc8_[_loc3_]);
                _loc8_[_loc3_] = -1;
            }
            _loc3_++;
        }
        _loc3_ = 0;
        _loc4_ = 0;
        while (_loc3_ < _loc9_) {
            if (_loc8_[_loc3_] >= 0) {
                _loc8_[_loc18_ = _loc4_++] = _loc8_[_loc3_];
            }
            _loc3_++;
        }
        if (_loc4_ > 0) {
            _loc8_.length = _loc4_;
        }
        else {
            param1.indices = null;
        }
        if (param1.splitIndices != null) {
            param1.splitTree = new CollisionKdTree2D(this, param1);
            param1.splitTree.createTree();
        }
        if (param1.negativeNode.indices != null) {
            this.splitNode(param1.negativeNode);
        }
        if (param1.positiveNode.indices != null) {
            this.splitNode(param1.positiveNode);
        }
    }

    private checkNodeAxis(param1: CollisionKdNode, param2: number, param3: number, param4: number[], param5: number[]): void {
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: number = 0;
        var _loc12_: number = 0;
        var _loc13_: Boolean = false;
        var _loc14_: number = 0;
        var _loc15_: number = 0;
        var _loc16_: number = NaN;
        var _loc17_: AABB = null;
        var _loc18_: number = (param2 + 1) % 3;
        var _loc19_: number = (param2 + 2) % 3;
        var _loc20_: number = (param5[_loc18_ + 3] - param5[_loc18_]) * (param5[_loc19_ + 3] - param5[_loc19_]);
        var _loc21_: number = 0;
        while (_loc21_ < param3) {
            _loc6_ = param4[_loc21_];
            if (!isNaN(_loc6_)) {
                _loc7_ = _loc6_ - this.threshold;
                _loc8_ = _loc6_ + this.threshold;
                _loc9_ = _loc20_ * (_loc6_ - param5[param2]);
                _loc10_ = _loc20_ * (param5[param2 + 3] - _loc6_);
                _loc11_ = 0;
                _loc12_ = 0;
                _loc13_ = false;
                _loc14_ = param1.indices.length;
                _loc15_ = 0;
                while (_loc15_ < _loc14_) {
                    _loc17_ = this.staticBoundBoxes[param1.indices[_loc15_]];
                    CollisionKdTree._bb[0] = _loc17_.minX;
                    CollisionKdTree._bb[1] = _loc17_.minY;
                    CollisionKdTree._bb[2] = _loc17_.minZ;
                    CollisionKdTree._bb[3] = _loc17_.maxX;
                    CollisionKdTree._bb[4] = _loc17_.maxY;
                    CollisionKdTree._bb[5] = _loc17_.maxZ;
                    if (CollisionKdTree._bb[param2 + 3] <= _loc8_) {
                        if (CollisionKdTree._bb[param2] < _loc7_) {
                            _loc11_++;
                        }
                    }
                    else {
                        if (CollisionKdTree._bb[param2] < _loc7_) {
                            _loc13_ = true;
                            break;
                        }
                        _loc12_++;
                    }
                    _loc15_++;
                }
                _loc16_ = _loc9_ * _loc11_ + _loc10_ * _loc12_;
                if (!_loc13_ && _loc16_ < this.splitCost && _loc11_ > 0 && _loc12_ > 0) {
                    this.splitAxis = param2;
                    this.splitCost = _loc16_;
                    this.splitCoord = _loc6_;
                }
                _loc15_ = _loc21_ + 1;
                while (_loc15_ < param3) {
                    if (param4[_loc15_] >= _loc6_ - this.threshold && param4[_loc15_] <= _loc6_ + this.threshold) {
                        param4[_loc15_] = NaN;
                    }
                    _loc15_++;
                }
            }
            _loc21_++;
        }
    }

    public traceTree(): void {
        this.traceNode("", this.rootNode);
    }

    private traceNode(param1: String, param2: CollisionKdNode): void {
        if (param2 == null) {
            return;
        }
        this.traceNode(param1 + "-", param2.negativeNode);
        this.traceNode(param1 + "+", param2.positiveNode);
    }

    public destroyTree(): void {
        if (this.rootNode) {
            this.rootNode.destroy();
            this.rootNode = null;
        }
        if (this.staticChildren) {
            this.staticChildren.length = 0;
            this.staticChildren = null;
        }
        this.staticBoundBoxes.length = 0;
    }
}