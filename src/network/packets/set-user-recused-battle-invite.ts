import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserRecusedBattleInvitePacket extends Packet {

    public user: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_RECUSED_BATTLE_INVITE, bytes)
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