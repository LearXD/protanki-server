import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveBattlesScreenPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_BATTLES_SCREEN, bytes)
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