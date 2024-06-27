import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetScorePacket extends Packet {

    public score: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_SCORE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.score = bytes.readInt();

        return {
            score: this.score
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.score);
        return bytes;
    }
}