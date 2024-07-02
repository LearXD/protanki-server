import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendChangeQuestPacket extends Packet {

    public questId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_CHANGE_QUEST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.questId = bytes.readInt();
        return {
            questId: this.questId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.questId);
        return bytes;
    }
}