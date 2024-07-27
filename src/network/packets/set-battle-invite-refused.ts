import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleInviteRefusedPacket extends Packet {

    public user: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_INVITE_REFUSED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.user = bytes.readString();
        return {
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.user);
        return bytes;
    }
}