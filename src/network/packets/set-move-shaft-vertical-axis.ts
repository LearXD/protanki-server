import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetMoveShaftVerticalAxisPacket extends Packet {

    public shooter: string;
    public projectionOnVerticalAxis: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_MOVE_SHAFT_VERTICAL_AXIS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.projectionOnVerticalAxis = bytes.readFloat();

        return {
            shooter: this.shooter
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeFloat(this.projectionOnVerticalAxis);

        return bytes;
    }
}