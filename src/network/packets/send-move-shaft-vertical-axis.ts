import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendMoveShaftVerticalAxisPacket extends Packet {

    public projectionOnVerticalAxis: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_MOVE_SHAFT_VERTICAL_AXIS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.projectionOnVerticalAxis = bytes.readFloat();
        return {
            projectionOnVerticalAxis: this.projectionOnVerticalAxis
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeFloat(this.projectionOnVerticalAxis);
        return bytes;
    }
}