import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleUserStatusPacket extends Packet {

    public deaths: number;
    public kills: number;
    public score: number;
    public user: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_USER_STATUS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.deaths = bytes.readInt();
        this.kills = bytes.readInt();
        this.score = bytes.readInt();
        this.user = bytes.readString();

        return {
            deaths: this.deaths,
            kills: this.kills,
            score: this.score,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.deaths);
        bytes.writeInt(this.kills);
        bytes.writeInt(this.score);
        bytes.writeString(this.user);

        return bytes;
    }
}