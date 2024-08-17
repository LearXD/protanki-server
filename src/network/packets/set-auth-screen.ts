import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAuthScreenPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_AUTH_SCREEN, bytes)
    }

}