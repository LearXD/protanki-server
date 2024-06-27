import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendStopVulcanShotPacket extends Packet {

    public time: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_STOP_VULCAN_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.time = bytes.readInt();
        return {
            time: this.time
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.time);
        return bytes;
    }
}