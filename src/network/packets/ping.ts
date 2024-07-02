import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class PingPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.PING, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}