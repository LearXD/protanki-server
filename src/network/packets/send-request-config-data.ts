import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRequestConfigDataPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_REQUEST_CONFIG_DATA, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}