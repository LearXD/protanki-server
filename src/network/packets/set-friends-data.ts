import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetFriendsDataPacket extends Packet {

    public friendsAccepted: string[] = [];
    public friendsAcceptedNew: string[] = [];
    public friendsIncoming: string[] = [];
    public friendsIncomingNew: string[] = [];
    public friendsOutgoing: string[] = [];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_FRIENDS_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.friendsAccepted = bytes.readStringArray();
        this.friendsAcceptedNew = bytes.readStringArray();
        this.friendsIncoming = bytes.readStringArray();
        this.friendsIncomingNew = bytes.readStringArray();
        this.friendsOutgoing = bytes.readStringArray();

        return {
            friendsAccepted: this.friendsAccepted,
            friendsAcceptedNew: this.friendsAcceptedNew,
            friendsIncoming: this.friendsIncoming,
            friendsIncomingNew: this.friendsIncomingNew,
            friendsOutgoing: this.friendsOutgoing
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeStringArray(this.friendsAccepted);
        bytes.writeStringArray(this.friendsAcceptedNew);
        bytes.writeStringArray(this.friendsIncoming);
        bytes.writeStringArray(this.friendsIncomingNew);
        bytes.writeStringArray(this.friendsOutgoing);

        return bytes;
    }
}