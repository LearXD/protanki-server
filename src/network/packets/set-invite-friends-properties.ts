import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetInviteFriendsPropertiesPacket extends Packet {

    public hash: string;
    public host: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_INVITE_FRIENDS_PROPERTIES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.hash = bytes.readString();
        this.host = bytes.readString();
        return {
            hash: this.hash,
            host: this.host
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.hash);
        bytes.writeString(this.host);
        return bytes;
    }
}