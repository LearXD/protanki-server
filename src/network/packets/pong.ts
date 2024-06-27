import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class PongPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.PONG, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}