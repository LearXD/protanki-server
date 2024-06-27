import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class FindUserOnFriendListFoundPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.FIND_USER_ON_FRIEND_LIST_FOUND, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}