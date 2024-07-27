import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendStormTargetShotPacket extends Packet {

    public time: number;
    public relativeHitPoint: Vector3d;
    public target: string;
    public incarnation: number;
    public targetPosition: Vector3d;
    public hitPoint: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_STORM_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.relativeHitPoint = bytes.readVector3d();
        this.target = bytes.readString();
        this.incarnation = bytes.readShort();
        this.targetPosition = bytes.readVector3d();
        this.hitPoint = bytes.readVector3d();

        return {
            time: this.time,
            relativeHitPoint: this.relativeHitPoint,
            target: this.target,
            incarnation: this.incarnation,
            targetPosition: this.targetPosition,
            hitPoint: this.hitPoint
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeVector3d(this.relativeHitPoint);
        bytes.writeString(this.target);
        bytes.writeShort(this.incarnation);
        bytes.writeVector3d(this.targetPosition);
        bytes.writeVector3d(this.hitPoint);

        return bytes;
    }
}