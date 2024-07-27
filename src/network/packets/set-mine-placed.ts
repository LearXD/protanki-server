import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetMinePlacedPacket extends Packet {

    public mineId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_MINE_PLACED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.mineId = bytes.readString();
        return {
            mineId: this.mineId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.mineId);
        return bytes;
    }
}