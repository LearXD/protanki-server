import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetGarageCategoryPacket extends Packet {

    public category: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_GARAGE_CATEGORY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.category = bytes.readString();

        return {
            category: this.category
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.category);
        return bytes;
    }
}