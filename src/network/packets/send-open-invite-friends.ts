import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenInviteFriendsPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_OPEN_INVITE_FRIENDS, bytes)
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