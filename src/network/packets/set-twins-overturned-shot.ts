import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTwinsOverturnedShotPacket extends Packet {

    public shooter: string;
    public barrel: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TWINS_OVERTURNED_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.shooter = bytes.readString();
        this.barrel = bytes.readByte()
        return {
            shooter: this.shooter,
            barrel: this.barrel
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.shooter)
        bytes.writeByte(this.barrel)
        return bytes;
    }
}