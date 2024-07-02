import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveMinePacket extends Packet {

    public mineId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_MINE, bytes)
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