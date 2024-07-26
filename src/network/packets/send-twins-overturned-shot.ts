import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendTwinsOverturnedShotPacket extends Packet {

    public time: number
    public barrel: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_TWINS_OVERTURNED_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.time = bytes.readInt();
        this.barrel = bytes.readByte();
        return {
            time: this.time,
            barrel: this.barrel
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.time);
        bytes.writeByte(this.barrel);
        return bytes;
    }
}