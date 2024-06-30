import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserNotFoundOnFriendsListPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.SET_USER_NOT_FOUND_ON_FRIENDS_LIST, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}