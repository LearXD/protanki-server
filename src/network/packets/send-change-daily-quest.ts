import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendChangeDailyQuestPacket extends Packet {

    public questId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_CHANGE_DAILY_QUEST, bytes)
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