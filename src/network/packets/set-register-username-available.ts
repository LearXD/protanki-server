import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRegisterUsernameAvailablePacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REGISTER_USERNAME_AVAILABLE, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}