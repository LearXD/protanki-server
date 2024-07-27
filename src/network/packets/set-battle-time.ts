import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleTimePacket extends Packet {

    public time: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_TIME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();

        return {
            time: this.time
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.time);
        return bytes;
    }
}