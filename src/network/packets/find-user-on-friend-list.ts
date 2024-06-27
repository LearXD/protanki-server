import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class FindUserOnFriendsListPacket extends Packet {

    public userId: string;

    constructor(bytes: ByteArray) {
        super(Protocol.FIND_USER_ON_FRIENDS_LIST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();

        return {
            userId: this.userId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.userId);
        return bytes;
    }
}