import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRefuseAllFriendRequestsPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_REFUSE_ALL_FRIEND_REQUESTS, bytes)
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