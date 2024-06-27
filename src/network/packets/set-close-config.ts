import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCloseConfigPacket extends Packet {


    constructor(bytes: ByteArray) {
        super(Protocol.SET_CLOSE_CONFIG, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {

        }
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}