import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUseDrugPacket extends Packet {

    public itemId: string;
    public time: number;
    public decrease: boolean

    constructor(bytes: ByteArray) {
        super(Protocol.SET_USE_DRUG, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.itemId = bytes.readString();
        this.time = bytes.readInt();
        this.decrease = bytes.readBoolean();

        return {
            itemId: this.itemId,
            time: this.time,
            decrease: this.decrease
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.itemId);
        bytes.writeInt(this.time);
        bytes.writeBoolean(this.decrease);

        return bytes;
    }
}