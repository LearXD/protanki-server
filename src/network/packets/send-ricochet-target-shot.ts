import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRicochetTargetShotPacket extends Packet {

    public time: number;
    public target: string;
    public shotId: number;
    public targetPosition: Vector3d;
    public hitPoints: Vector3d[];

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_RICOCHET_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.target = bytes.readString();
        this.shotId = bytes.readInt();
        this.targetPosition = bytes.readVector3d();
        this.hitPoints = bytes.readVector3dArray();

        return {
            time: this.time,
            target: this.target,
            shotId: this.shotId,
            targetPosition: this.targetPosition,
            hitPoints: this.hitPoints
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeString(this.target);
        bytes.writeInt(this.shotId);
        bytes.writeVector3d(this.targetPosition);
        bytes.writeVector3dArray(this.hitPoints);

        return bytes;
    }
}