import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetIncorrectPasswordPopupPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_INCORRECT_PASSWORD_POPUP, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        return this.getBytes()
    }
}