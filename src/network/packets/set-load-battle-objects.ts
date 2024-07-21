import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetLoadBattleObjectsPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LOAD_BATTLE_OBJECTS, bytes)
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