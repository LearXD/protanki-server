import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendStormTargetShotPacket extends Packet {

    public time: number;
    public relativeHitPoint: Vector3d;
    public target: string;
    public short_1: number;
    public vector_1: Vector3d;
    public vector_2: Vector3d;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_STORM_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.relativeHitPoint = bytes.readVector3d();
        this.target = bytes.readString();
        this.short_1 = bytes.readShort();
        this.vector_1 = bytes.readVector3d();
        this.vector_2 = bytes.readVector3d();

        return {
            time: this.time,
            relativeHitPoint: this.relativeHitPoint,
            target: this.target,
            short_1: this.short_1,
            vector_1: this.vector_1,
            vector_2: this.vector_2
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeVector3d(this.relativeHitPoint);
        bytes.writeString(this.target);
        bytes.writeShort(this.short_1);
        bytes.writeVector3d(this.vector_1);
        bytes.writeVector3d(this.vector_2);

        return bytes;
    }
}