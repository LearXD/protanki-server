import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class IncorrectPasswordPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.INCORRECT_PASSWORD, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}