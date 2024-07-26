import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendTwinsTargetShotPacket extends Packet {

    public time: number
    public shotId: number
    public target: string
    public vector_1: Vector3d
    public vector_2: Vector3d

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_TWINS_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.shotId = bytes.readInt();
        this.target = bytes.readString();
        this.vector_1 = bytes.readVector3d();
        this.vector_2 = bytes.readVector3d();

        return {
            time: this.time,
            shotId: this.shotId,
            target: this.target,
            vector_1: this.vector_1,
            vector_2: this.vector_2
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.time);
        bytes.writeInt(this.shotId);
        bytes.writeString(this.target);
        bytes.writeVector3d(this.vector_1);
        bytes.writeVector3d(this.vector_2);
        return bytes;
    }
}