import { AABB } from "../aabb";
import { CollisionKdNode } from "../collision-kd-node";
import { CollisionKdTree } from "../collision-kd-tree";

export class CollisionKdTree2D {

    private static nodeBoundBoxThreshold: AABB = new AABB();

    private static splitCoordsX: number[] = [];

    private static splitCoordsY: number[] = [];

    private static splitCoordsZ: number[] = [];

    private static _nodeBB: number[] = []

    private static _bb: number[] = []


    public threshold: number = 0.1;

    public minPrimitivesPerNode: number = 1;

    public parentTree: CollisionKdTree;

    public parentNode: CollisionKdNode;

    public rootNode: CollisionKdNode;

    private splitAxis: number;

    private splitCost: number;

    private splitCoord: number;

    public constructor(param1: CollisionKdTree, param2: CollisionKdNode) {
        // super();
        this.parentTree = param1;
        this.parentNode = param2;
    }

    public createTree(): void {
        this.rootNode = new CollisionKdNode();
        this.rootNode.boundBox = this.parentNode.boundBox.clone();
        this.rootNode.indices = [];
        var _loc1_: number = (this.parentNode.splitIndices.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            this.rootNode.indices[_loc2_] = this.parentNode.splitIndices[_loc2_];
            _loc2_++;
        }
        this.splitNode(this.rootNode);
        CollisionKdTree2D.splitCoordsX.length = CollisionKdTree2D.splitCoordsY.length = CollisionKdTree2D.splitCoordsZ.length = 0;
    }

    private splitNode(param1: CollisionKdNode): void {
        var _loc2_: number[] = null;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        var _loc5_: AABB = null;
        var _loc6_: number = 0;
        var _loc7_: number = 0;
        var _loc8_: number = 0;
        var _loc9_: AABB = null;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        if (param1.indices.length <= this.minPrimitivesPerNode) {
            return;
        }
        _loc2_ = param1.indices;
        _loc5_ = param1.boundBox;
        CollisionKdTree2D.nodeBoundBoxThreshold.minX = _loc5_.minX + this.threshold;
        CollisionKdTree2D.nodeBoundBoxThreshold.minY = _loc5_.minY + this.threshold;
        CollisionKdTree2D.nodeBoundBoxThreshold.minZ = _loc5_.minZ + this.threshold;
        CollisionKdTree2D.nodeBoundBoxThreshold.maxX = _loc5_.maxX - this.threshold;
        CollisionKdTree2D.nodeBoundBoxThreshold.maxY = _loc5_.maxY - this.threshold;
        CollisionKdTree2D.nodeBoundBoxThreshold.maxZ = _loc5_.maxZ - this.threshold;
        var _loc12_: number = this.threshold * 2;
        var _loc13_: AABB[] = this.parentTree.staticBoundBoxes;
        var _loc14_: number = (_loc2_.length);
        _loc3_ = 0;
        while (_loc3_ < _loc14_) {
            _loc9_ = _loc13_[_loc2_[_loc3_]];
            if (this.parentNode.axis != 0) {
                if (_loc9_.minX > CollisionKdTree2D.nodeBoundBoxThreshold.minX) {
                    var _loc19_: any;
                    CollisionKdTree2D.splitCoordsX[_loc19_ = _loc6_++] = _loc9_.minX;
                }
                if (_loc9_.maxX < CollisionKdTree2D.nodeBoundBoxThreshold.maxX) {
                    CollisionKdTree2D.splitCoordsX[_loc19_ = _loc6_++] = _loc9_.maxX;
                }
            }
            if (this.parentNode.axis != 1) {
                if (_loc9_.minY > CollisionKdTree2D.nodeBoundBoxThreshold.minY) {
                    CollisionKdTree2D.splitCoordsY[_loc19_ = _loc7_++] = _loc9_.minY;
                }
                if (_loc9_.maxY < CollisionKdTree2D.nodeBoundBoxThreshold.maxY) {
                    CollisionKdTree2D.splitCoordsY[_loc19_ = _loc7_++] = _loc9_.maxY;
                }
            }
            if (this.parentNode.axis != 2) {
                if (_loc9_.minZ > CollisionKdTree2D.nodeBoundBoxThreshold.minZ) {
                    CollisionKdTree2D.splitCoordsZ[_loc19_ = _loc8_++] = _loc9_.minZ;
                }
                if (_loc9_.maxZ < CollisionKdTree2D.nodeBoundBoxThreshold.maxZ) {
                    CollisionKdTree2D.splitCoordsZ[_loc19_ = _loc8_++] = _loc9_.maxZ;
                }
            }
            _loc3_++;
        }
        this.splitAxis = -1;
        this.splitCost = 1e+308;
        CollisionKdTree2D._nodeBB[0] = _loc5_.minX;
        CollisionKdTree2D._nodeBB[1] = _loc5_.minY;
        CollisionKdTree2D._nodeBB[2] = _loc5_.minZ;
        CollisionKdTree2D._nodeBB[3] = _loc5_.maxX;
        CollisionKdTree2D._nodeBB[4] = _loc5_.maxY;
        CollisionKdTree2D._nodeBB[5] = _loc5_.maxZ;
        if (this.parentNode.axis != 0) {
            this.checkNodeAxis(param1, 0, _loc6_, CollisionKdTree2D.splitCoordsX, CollisionKdTree2D._nodeBB);
        }
        if (this.parentNode.axis != 1) {
            this.checkNodeAxis(param1, 1, _loc7_, CollisionKdTree2D.splitCoordsY, CollisionKdTree2D._nodeBB);
        }
        if (this.parentNode.axis != 2) {
            this.checkNodeAxis(param1, 2, _loc8_, CollisionKdTree2D.splitCoordsZ, CollisionKdTree2D._nodeBB);
        }
        if (this.splitAxis < 0) {
            return;
        }
        var _loc15_: any = this.splitAxis == 0;
        var _loc16_: any = this.splitAxis == 1;
        param1.axis = this.splitAxis;
        param1.coord = this.splitCoord;
        param1.negativeNode = new CollisionKdNode();
        param1.negativeNode.parent = param1;
        param1.negativeNode.boundBox = _loc5_.clone();
        param1.positiveNode = new CollisionKdNode();
        param1.positiveNode.parent = param1;
        param1.positiveNode.boundBox = _loc5_.clone();
        if (_loc15_) {
            param1.negativeNode.boundBox.maxX = param1.positiveNode.boundBox.minX = this.splitCoord;
        }
        else if (_loc16_) {
            param1.negativeNode.boundBox.maxY = param1.positiveNode.boundBox.minY = this.splitCoord;
        }
        else {
            param1.negativeNode.boundBox.maxZ = param1.positiveNode.boundBox.minZ = this.splitCoord;
        }
        var _loc17_: number = this.splitCoord - this.threshold;
        var _loc18_: number = this.splitCoord + this.threshold;
        _loc3_ = 0;
        while (_loc3_ < _loc14_) {
            _loc9_ = _loc13_[_loc2_[_loc3_]];
            _loc10_ = _loc15_ ? (_loc9_.minX) : (_loc16_ ? (_loc9_.minY) : (_loc9_.minZ));
            if ((_loc11_ = _loc15_ ? (_loc9_.maxX) : (_loc16_ ? (_loc9_.maxY) : (_loc9_.maxZ))) <= _loc18_) {
                if (_loc10_ < _loc17_) {
                    if (param1.negativeNode.indices == null) {
                        param1.negativeNode.indices = [];
                    }
                    param1.negativeNode.indices.push(_loc2_[_loc3_]);
                    _loc2_[_loc3_] = -1;
                }
            }
            else if (_loc10_ >= _loc17_) {
                if (_loc11_ > _loc18_) {
                    if (param1.positiveNode.indices == null) {
                        param1.positiveNode.indices = [];
                    }
                    param1.positiveNode.indices.push(_loc2_[_loc3_]);
                    _loc2_[_loc3_] = -1;
                }
            }
            _loc3_++;
        }
        _loc3_ = 0;
        _loc4_ = 0;
        while (_loc3_ < _loc14_) {
            if (_loc2_[_loc3_] >= 0) {
                _loc2_[_loc19_ = _loc4_++] = _loc2_[_loc3_];
            }
            _loc3_++;
        }
        if (_loc4_ > 0) {
            _loc2_.length = _loc4_;
        }
        else {
            param1.indices = null;
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
        var _loc13_: boolean = false;
        var _loc14_: number = 0;
        var _loc15_: number = 0;
        var _loc16_: number = NaN;
        var _loc17_: AABB = null;
        var _loc18_: number = (param2 + 1) % 3;
        var _loc19_: number = (param2 + 2) % 3;
        var _loc20_: number = (param5[_loc18_ + 3] - param5[_loc18_]) * (param5[_loc19_ + 3] - param5[_loc19_]);
        var _loc21_: AABB[] = this.parentTree.staticBoundBoxes;
        var _loc22_: number = 0;
        while (_loc22_ < param3) {
            _loc6_ = param4[_loc22_];
            if (!isNaN(_loc6_)) {
                _loc7_ = _loc6_ - this.threshold;
                _loc8_ = _loc6_ + this.threshold;
                _loc9_ = _loc20_ * (_loc6_ - param5[param2]);
                _loc10_ = _loc20_ * (param5[(param2 + 3)] - _loc6_);
                _loc11_ = 0;
                _loc12_ = 0;
                _loc13_ = false;
                _loc14_ = (param1.indices.length);
                _loc15_ = 0;
                while (_loc15_ < _loc14_) {
                    _loc17_ = _loc21_[param1.indices[_loc15_]];
                    CollisionKdTree2D._bb[0] = _loc17_.minX;
                    CollisionKdTree2D._bb[1] = _loc17_.minY;
                    CollisionKdTree2D._bb[2] = _loc17_.minZ;
                    CollisionKdTree2D._bb[3] = _loc17_.maxX;
                    CollisionKdTree2D._bb[4] = _loc17_.maxY;
                    CollisionKdTree2D._bb[5] = _loc17_.maxZ;
                    if (CollisionKdTree2D._bb[param2 + 3] <= _loc8_) {
                        if (CollisionKdTree2D._bb[param2] < _loc7_) {
                            _loc11_++;
                        }
                    }
                    else {
                        if (CollisionKdTree2D._bb[param2] < _loc7_) {
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
                _loc15_ = _loc22_ + 1;
                while (_loc15_ < param3) {
                    if (param4[_loc15_] >= _loc6_ - this.threshold && param4[_loc15_] <= _loc6_ + this.threshold) {
                        param4[_loc15_] = NaN;
                    }
                    _loc15_++;
                }
            }
            _loc22_++;
        }
    }

    public destroyTree(): void {
        this.parentTree = null;
        this.parentNode = null;
        if (this.rootNode) {
            this.rootNode.destroy();
            this.rootNode = null;
        }
    }
}
