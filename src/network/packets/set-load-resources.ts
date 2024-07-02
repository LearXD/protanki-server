import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";


export class SetLoadResourcesPacket extends Packet {

    public resources: any[];
    public callbackId: number = 0

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LOAD_RESOURCES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const json = bytes.readString()
        this.callbackId = bytes.readInt()

        try {
            this.resources = JSON.parse(json).resources
        } catch (e) {
            console.error('Invalid resources format', this.resources)
        }

        return {
            resources: this.resources,
            callbackId: this.callbackId
        }
    }

    public encode() {
        const bytes = new ByteArray()

        try {
            bytes.writeString(JSON.stringify({ resources: this.resources }))
        } catch (e) {
            console.error('Invalid resources format', this.resources)
            bytes.writeString('{}')
        }

        bytes.writeInt(this.callbackId)

        return bytes
    }

}