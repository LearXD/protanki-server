import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRegisterUsernameAlreadyUsedPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REGISTER_USERNAME_ALREADY_USED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {

        }
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}