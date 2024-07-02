import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetDrugQuantityPacket extends Packet {

    public itemId: string;
    public quantity: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_DRUG_QUANTITY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.itemId = bytes.readString();
        this.quantity = bytes.readInt();

        return {
            itemId: this.itemId,
            quantity: this.quantity
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.itemId);
        bytes.writeInt(this.quantity);
        return bytes;
    }
}