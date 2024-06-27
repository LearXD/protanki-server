import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendTwinsFirstShotPacket extends Packet {

    public time: number;
    public shotId: number;
    public target: Vector3d;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_TWINS_FIRST_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.shotId = bytes.readInt();
        this.target = bytes.readVector3d();

        return {
            time: this.time,
            shotId: this.shotId,
            target: this.target
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeInt(this.shotId);
        bytes.writeVector3d(this.target);

        return bytes;
    }
}