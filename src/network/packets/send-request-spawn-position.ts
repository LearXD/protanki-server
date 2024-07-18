import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRequestSpawnPositionPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_REQUEST_SPAWN_POSITION, bytes)
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