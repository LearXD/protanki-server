import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendLoadBattlesScreenPacket extends Packet {


    constructor(bytes: ByteArray) {
        super(Protocol.SEND_LOAD_BATTLES_SCREEN, bytes)
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