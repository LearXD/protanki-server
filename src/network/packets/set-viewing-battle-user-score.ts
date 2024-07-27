import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetViewingBattleUserScorePacket extends Packet {

    public battle: string
    public user: string
    public score: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_VIEWING_BATTLE_USER_SCORE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();
        this.user = bytes.readString();
        this.score = bytes.readInt();

        return {
            battle: this.battle,
            user: this.user,
            score: this.score
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);
        bytes.writeString(this.user);
        bytes.writeInt(this.score);

        return bytes;
    }
}