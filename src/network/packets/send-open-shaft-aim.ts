import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenShaftAimPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_OPEN_SHAFT_AIM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}