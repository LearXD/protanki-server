import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class ResolveCallbackPacket extends Packet {

    public callbackId: number

    constructor(bytes?: ByteArray) {
        super(Protocol.RESOLVE_CALLBACK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes()
        this.callbackId = bytes.readInt()
        return {
            callbackId: this.callbackId
        }
    }

    public encode() {
        const bytes = new ByteArray()
        bytes.writeInt(this.callbackId)
        return bytes
    }
}