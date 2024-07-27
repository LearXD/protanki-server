import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendLanguagePacket extends Packet {

    public language: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_LANGUAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.language = bytes.readString();

        return {
            language: this.language
        }
    }

    public encode() {
        const bytes = new ByteArray()
        bytes.writeString(this.language)
        return bytes
    }
}