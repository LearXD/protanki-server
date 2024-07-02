import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetExplodeMinePacket extends Packet {

    public mineId: string;
    public targetId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_EXPLODE_MINE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.mineId = bytes.readString();
        this.targetId = bytes.readString();

        return {
            mineId: this.mineId,
            targetId: this.targetId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.mineId);
        bytes.writeString(this.targetId);
        return bytes;
    }
}