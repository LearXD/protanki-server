import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAuthResourcesPacket extends Packet {

    public bgResource: number
    public enableRequiredEmail: boolean
    public maxPasswordLength: number
    public minPasswordLength: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_AUTH_RESOURCES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes()

        this.bgResource = bytes.readInt()
        this.enableRequiredEmail = bytes.readBoolean()
        this.maxPasswordLength = bytes.readInt()
        this.minPasswordLength = bytes.readInt()

        return {
            bgResource: this.bgResource,
            enableRequiredEmail: this.enableRequiredEmail,
            maxPasswordLength: this.maxPasswordLength,
            minPasswordLength: this.minPasswordLength
        }
    }

    public encode() {
        const bytes = new ByteArray()

        bytes.writeInt(this.bgResource)
        bytes.writeBoolean(this.enableRequiredEmail)
        bytes.writeInt(this.maxPasswordLength)
        bytes.writeInt(this.minPasswordLength)

        return bytes
    }
}