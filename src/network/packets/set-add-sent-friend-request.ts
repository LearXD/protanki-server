import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAddSentFriendRequestPacket extends Packet {

    public userId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ADD_SENT_FRIEND_REQUEST, bytes)
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