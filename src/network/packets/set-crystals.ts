import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCrystalsPacket extends Packet {

    public crystals: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CRYSTALS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.crystals = bytes.readInt();

        return {
            crystals: this.crystals
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.crystals);
        return bytes;
    }
}