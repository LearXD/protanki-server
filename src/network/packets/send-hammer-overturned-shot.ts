import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendHammerOverturnedShotPacket extends Packet {

    public shotId: number
    public direction: Vector3d

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_HAMMER_OVERTURNED_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.shotId = bytes.readInt();
        this.direction = bytes.readVector3d();
        return {
            shotId: this.shotId,
            direction: this.direction
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.shotId);
        bytes.writeVector3d(this.direction);
        return bytes;
    }
}