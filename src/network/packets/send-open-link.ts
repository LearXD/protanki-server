import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenLinkPacket extends Packet {

    public link: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_OPEN_LINK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.link = bytes.readString();
        return {
            link: this.link
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.link);
        return bytes;
    }
}