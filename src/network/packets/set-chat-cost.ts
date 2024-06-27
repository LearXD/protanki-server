import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetChatCostPacket extends Packet {

    public symbolCost: number;
    public enterCost: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CHAT_COST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.symbolCost = bytes.readInt();
        this.enterCost = bytes.readInt();

        return {
            symbolCost: this.symbolCost,
            enterCost: this.enterCost
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.symbolCost);
        bytes.writeInt(this.enterCost);

        return bytes;
    }
}