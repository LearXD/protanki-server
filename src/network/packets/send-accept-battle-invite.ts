import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendAcceptBattleInvitePacket extends Packet {

    public sender: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_ACCEPT_BATTLE_INVITE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.sender = bytes.readString();
        return {
            sender: this.sender
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.sender);
        return bytes;
    }
}