import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBattleInvitePacket extends Packet {

    public user: string;
    public battle: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_BATTLE_INVITE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.user = bytes.readString();
        this.battle = bytes.readString();

        return {
            user: this.user,
            battle: this.battle
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.user);
        bytes.writeString(this.battle);
        return bytes;
    }
}