import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class ResolveFullLoadedPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.RESOLVE_FULL_LOADED, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}