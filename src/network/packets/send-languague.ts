import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SEND_LANGUAGE extends Packet {

    public language: string

    constructor(bytes: ByteArray) {
        super(Protocol.SET_LANGUAGE, bytes)
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