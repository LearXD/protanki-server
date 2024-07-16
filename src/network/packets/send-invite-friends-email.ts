import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendInviteFriendsEmailPacket extends Packet {

    public emails: string[]
    public user: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_INVITE_FRIENDS_EMAIL, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.emails = bytes.readStringArray();
        this.user = bytes.readString();
        return {
            emails: this.emails,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeStringArray(this.emails);
        bytes.writeString(this.user);
        return bytes;
    }
}