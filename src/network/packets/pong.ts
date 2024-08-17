import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class PongPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.PONG, bytes)
    }

}