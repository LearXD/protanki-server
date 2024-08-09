import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";


export class SendIsisTargetShotPacket extends Packet {

    public time: number;
    public target: string;
    public incarnation: number;
    public position: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_ISIS_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.target = bytes.readString();
        this.incarnation = bytes.readShort()
        this.position = bytes.readVector3d();

        return {
            time: this.time,
            target: this.target,
            incarnation: this.incarnation,
            position: this.position
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeString(this.target);
        bytes.writeShort(this.incarnation);
        bytes.writeVector3d(this.position);

        return bytes;
    }
}