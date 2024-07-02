import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetWrongLoginHashPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_WRONG_LOGIN_HASH, bytes)
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