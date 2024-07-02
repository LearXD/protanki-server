import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendTwinsSecondShotPacket extends Packet {

    public time: number;
    public barrel: number;
    public shotId: number;
    public shotDirection: Vector3d

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_TWINS_SECOND_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.barrel = bytes.readByte();
        this.shotId = bytes.readInt();
        this.shotDirection = bytes.readVector3d();

        return {
            time: this.time,
            barrel: this.barrel,
            shotId: this.shotId,
            shotDirection: this.shotDirection
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeByte(this.barrel);
        bytes.writeInt(this.shotId);
        bytes.writeVector3d(this.shotDirection);

        return bytes;
    }
}