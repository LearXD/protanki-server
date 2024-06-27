import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class ResolveValidateResourcePacketPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.RESOLVE_VALIDATE_RESOURCE, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}