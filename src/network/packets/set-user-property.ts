import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserPropertyPacket extends Packet {

    public crystals: number;
    public currentRankScore: number;
    public durationCrystalAbonement: number;
    public hasDoubleCrystal: boolean;
    public nextRankScore: number;
    public place: number;
    public rank: number;
    public rating: number;
    public score: number;
    public serverNumber: number;
    public uid: string
    public userProfileUrl: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_PROPERTY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.crystals = bytes.readInt();
        this.currentRankScore = bytes.readInt();
        this.durationCrystalAbonement = bytes.readInt();
        this.hasDoubleCrystal = bytes.readBoolean();
        this.nextRankScore = bytes.readInt();
        this.place = bytes.readInt();
        this.rank = bytes.readByte();
        this.rating = bytes.readFloat();
        this.score = bytes.readInt();
        this.serverNumber = bytes.readInt();
        this.uid = bytes.readString();
        this.userProfileUrl = bytes.readString();

        return {
            crystals: this.crystals,
            currentRankScore: this.currentRankScore,
            durationCrystalAbonement: this.durationCrystalAbonement,
            hasDoubleCrystal: this.hasDoubleCrystal,
            nextRankScore: this.nextRankScore,
            place: this.place,
            rank: this.rank,
            rating: this.rating,
            score: this.score,
            serverNumber: this.serverNumber,
            uid: this.uid,
            userProfileUrl: this.userProfileUrl
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.crystals);
        bytes.writeInt(this.currentRankScore);
        bytes.writeInt(this.durationCrystalAbonement);
        bytes.writeBoolean(this.hasDoubleCrystal);
        bytes.writeInt(this.nextRankScore);
        bytes.writeInt(this.place);
        bytes.writeByte(this.rank);
        bytes.writeFloat(this.rating);
        bytes.writeInt(this.score);
        bytes.writeInt(this.serverNumber);
        bytes.writeString(this.uid);
        bytes.writeString(this.userProfileUrl);

        return bytes;
    }
}