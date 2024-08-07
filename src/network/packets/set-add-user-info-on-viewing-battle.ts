import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAddUserInfoOnViewingBattlePacket extends Packet {

    public battle: string;
    public kills: number;
    public score: number;
    public suspicious: boolean;
    public user: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ADD_USER_INFO_ON_VIEWING_BATTLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();
        this.kills = bytes.readInt();
        this.score = bytes.readInt();
        this.suspicious = bytes.readBoolean();
        this.user = bytes.readString();

        return {
            battle: this.battle,
            kills: this.kills,
            score: this.score,
            suspicious: this.suspicious,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);
        bytes.writeInt(this.kills);
        bytes.writeInt(this.score);
        bytes.writeBoolean(this.suspicious);
        bytes.writeString(this.user);

        return bytes;
    }
}