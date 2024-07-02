import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendStartFreezeShootPacket extends Packet {

    public time: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_START_FREEZE_SHOOT, bytes)
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