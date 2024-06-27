import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class OpenConfigPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.OPEN_CONFIG, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}