import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SomeJsonRankUpPacket extends Packet {

    public json: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SOME_JSON_RANK_UP, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.json = bytes.readString();

        return {
            json: this.json
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.json);
        return bytes;
    }
}