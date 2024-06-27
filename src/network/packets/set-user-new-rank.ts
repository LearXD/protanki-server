import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserNewRankPacket extends Packet {

    public userId: string
    public newRank: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_USER_NEW_RANK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();
        this.newRank = bytes.readInt();

        return {
            userId: this.userId,
            newRank: this.newRank
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.userId);
        bytes.writeInt(this.newRank);

        return bytes;
    }
}