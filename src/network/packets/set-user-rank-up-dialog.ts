import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserRankUpDialogPacket extends Packet {

    public rank: number
    public score: number
    public currentRankScore: number
    public nextRankScore: number
    public bonusCrystals: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_USER_RANK_UP_DIALOG, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.rank = bytes.readInt();
        this.score = bytes.readInt();
        this.currentRankScore = bytes.readInt();
        this.nextRankScore = bytes.readInt();
        this.bonusCrystals = bytes.readInt();

        return {
            rank: this.rank,
            score: this.score,
            currentRankScore: this.currentRankScore,
            nextRankScore: this.nextRankScore,
            bonusCrystals: this.bonusCrystals
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.rank);
        bytes.writeInt(this.score);
        bytes.writeInt(this.currentRankScore);
        bytes.writeInt(this.nextRankScore);
        bytes.writeInt(this.bonusCrystals);

        return bytes;
    }
}