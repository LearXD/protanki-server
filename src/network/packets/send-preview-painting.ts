import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendPreviewPaintingPacket extends Packet {

    public item: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_PREVIEW_PAINTING, bytes)
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