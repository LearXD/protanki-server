import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveBattleScreenPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_BATTLE_SCREEN, bytes)
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