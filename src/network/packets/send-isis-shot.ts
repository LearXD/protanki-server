import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendIsisShotPacket extends Packet {

    public time: number;
    public target: string;
    public type: number;
    public vector_1: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_ISIS_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.target = bytes.readString();
        this.type = bytes.readShort();
        this.vector_1 = bytes.readVector3d();

        return {
            time: this.time,
            target: this.target,
            type: this.type,
            vector_1: this.vector_1
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeString(this.target);
        bytes.writeShort(this.type);
        bytes.writeVector3d(this.vector_1);

        return bytes;
    }
}