import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetViewingBattleUserKillsPacket extends Packet {

    public battle: string
    public user: string
    public kills: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_VIEWING_BATTLE_USER_KILLS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();
        this.user = bytes.readString();
        this.kills = bytes.readInt();

        return {
            battle: this.battle,
            user: this.user,
            kills: this.kills
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);
        bytes.writeString(this.user);
        bytes.writeInt(this.kills);

        return bytes;
    }
}