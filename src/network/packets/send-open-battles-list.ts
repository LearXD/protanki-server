import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenBattlesListPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_OPEN_BATTLES_LIST, bytes)
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