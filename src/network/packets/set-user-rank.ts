import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserRankPacket extends Packet {

    public rank: number;
    public user: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_RANK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.rank = bytes.readInt();
        this.user = bytes.readString();

        return {
            rank: this.rank,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.rank);
        bytes.writeString(this.user);

        return bytes;
    }
}