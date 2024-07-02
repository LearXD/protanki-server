import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveGarageItemPacket extends Packet {

    public item: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_GARAGE_ITEM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.item = bytes.readString();

        return {
            item: this.item
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.item);
        return bytes;
    }
}