import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendChatMessagePacket extends Packet {

    public target: string
    public text: string

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_CHAT_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.target = bytes.readString();
        this.text = bytes.readString();

        return {
            target: this.target,
            text: this.text
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.target);
        bytes.writeString(this.text);

        return bytes;
    }
}