import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class PingPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.PING, bytes)
    }

}