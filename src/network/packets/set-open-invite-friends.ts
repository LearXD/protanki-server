import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IInvitedFriend {
    income: number
    user: string
}

export class SetOpenInviteFriendsPacket extends Packet {

    public invites: IInvitedFriend[]
    public inviteLink: string;
    public banner: string;
    public inviteMessage: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_OPEN_INVITE_FRIENDS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const invitesLength = bytes.readInt();
        this.invites = [];
        for (let i = 0; i < invitesLength; i++) {
            this.invites.push({
                income: bytes.readInt(),
                user: bytes.readString()
            })
        }

        this.inviteLink = bytes.readString();
        this.banner = bytes.readString();
        this.inviteMessage = bytes.readString();

        return {
            invites: this.invites,
            inviteLink: this.inviteLink,
            banner: this.banner,
            inviteMessage: this.inviteMessage
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.invites.length);
        this.invites.forEach(invite => {
            bytes.writeInt(invite.income);
            bytes.writeString(invite.user);
        });
        bytes.writeString(this.inviteLink);
        bytes.writeString(this.banner);
        bytes.writeString(this.inviteMessage);
        return bytes;
    }
}