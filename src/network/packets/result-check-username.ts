import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class ResultCheckUsernamePacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.RESULT_CHECK_USERNAME, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}