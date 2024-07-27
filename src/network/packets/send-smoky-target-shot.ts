import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendSmokyTargetShotPacket extends Packet {

    public time: number;
    public target: string;
    public incarnation: number;
    public targetPosition: Vector3d;
    public hitPoint: Vector3d;
    public hitPointPosition: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_SMOKY_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.target = bytes.readString();
        this.incarnation = bytes.readShort();
        this.targetPosition = bytes.readVector3d();
        this.hitPoint = bytes.readVector3d();
        this.hitPointPosition = bytes.readVector3d();

        return {
            time: this.time,
            target: this.target,
            incarnation: this.incarnation,
            targetPosition: this.targetPosition,
            hitPoint: this.hitPoint,
            hitPointPosition: this.hitPointPosition
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeString(this.target);
        bytes.writeShort(this.incarnation);
        bytes.writeVector3d(this.targetPosition);
        bytes.writeVector3d(this.hitPoint);
        bytes.writeVector3d(this.hitPointPosition);

        return bytes;
    }
}