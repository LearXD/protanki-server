import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendStormHitPointShotPacket extends Packet {

    public time: number;
    public hitPoint: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_STORM_HIT_POINT_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.hitPoint = bytes.readVector3d();

        return {
            time: this.time,
            hitPoint: this.hitPoint
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeVector3d(this.hitPoint);

        return bytes;
    }
}