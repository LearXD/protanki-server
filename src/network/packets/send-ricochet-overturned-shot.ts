import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRicochetOverturnedShotPacket extends Packet {

    public shotId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_RICOCHET_OVERTURNED_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.shotId = bytes.readInt();
        return {
            shotId: this.shotId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.shotId);
        return bytes;
    }
}