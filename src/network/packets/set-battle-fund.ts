import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleFundPacket extends Packet {

    public fund: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_FUND, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.fund = bytes.readInt();

        return {
            fund: this.fund
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.fund);

        return bytes;
    }
}