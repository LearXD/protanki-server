import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class OpenFriendsPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.OPEN_FRIENDS, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}