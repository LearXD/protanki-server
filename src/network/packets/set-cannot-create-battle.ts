import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCannotCreateBattlePacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CANNOT_CREATE_BATTLE, bytes)
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