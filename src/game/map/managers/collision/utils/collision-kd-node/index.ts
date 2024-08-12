import { AABB } from "../aabb";
import { CollisionKdTree2D } from "../collision-kd-tree-2d";

export class CollisionKdNode {


    public indices: number[];

    public splitIndices: number[];

    public boundBox: AABB;

    public parent: CollisionKdNode;

    public splitTree: CollisionKdTree2D;

    public axis: number = -1;

    public coord: number;

    public positiveNode: CollisionKdNode;

    public negativeNode: CollisionKdNode;

    public constructor() {
        //  super();
    }

    public destroy(): void {
        if (this.positiveNode) {
            this.positiveNode.destroy();
            this.positiveNode = null;
        }
        if (this.negativeNode) {
            this.negativeNode.destroy();
            this.negativeNode = null;
        }
        if (this.splitTree) {
            this.splitTree.destroyTree();
            this.splitTree = null;
        }
        this.parent = null;
        this.boundBox = null;
        this.indices = null;
        this.splitIndices = null;
    }
}
