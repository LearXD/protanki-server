import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRicochetTargetShotPacket extends Packet {

    public time: number;
    public target: string;
    public shotId: number;
    public vector_1: Vector3d;
    public vectors_1: Vector3d[];

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_RICOCHET_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.target = bytes.readString();
        this.shotId = bytes.readInt();
        this.vector_1 = bytes.readVector3d();
        this.vectors_1 = bytes.readVector3dArray();

        return {
            time: this.time,
            target: this.target,
            shotId: this.shotId,
            vector_1: this.vector_1,
            vectors_1: this.vectors_1
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeString(this.target);
        bytes.writeInt(this.shotId);
        bytes.writeVector3d(this.vector_1);
        bytes.writeVector3dArray(this.vectors_1);

        return bytes;
    }
}