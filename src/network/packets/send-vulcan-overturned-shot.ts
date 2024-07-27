import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendVulcanOverturnedShotPacket extends Packet {

    public time: number
    public direction: Vector3d

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_VULCAN_OVERTURNED_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.direction = bytes.readVector3d();

        return {
            time: this.time,
            direction: this.direction
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.time);
        bytes.writeVector3d(this.direction);
        return bytes;
    }
}