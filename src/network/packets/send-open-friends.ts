import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenFriendsPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_OPEN_FRIENDS, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}