import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendSpectateBattlePacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_SPECTATE_BATTLE, bytes)
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