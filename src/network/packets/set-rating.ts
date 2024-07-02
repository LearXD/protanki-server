import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRattingPacket extends Packet {

    public rating: number;
    public place: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_RATTING, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.rating = bytes.readFloat();
        this.place = bytes.readInt();

        return {
            rating: this.rating,
            place: this.place
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeFloat(this.rating);
        bytes.writeInt(this.place);

        return bytes;
    }
}