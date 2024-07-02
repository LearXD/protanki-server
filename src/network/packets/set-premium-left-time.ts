import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetPremiumLeftTimePacket extends Packet {

    public leftTimeInSeconds: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_PREMIUM_LEFT_TIME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.leftTimeInSeconds = bytes.readInt();
        return {
            leftTimeInSeconds: this.leftTimeInSeconds
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.leftTimeInSeconds);
        return bytes;
    }
}