import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveFriendPacket extends Packet {

    public userId: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_REMOVE_FRIEND, bytes)
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