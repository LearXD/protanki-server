import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetDailyQuestAlertPacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_DAILY_QUEST_ALERT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {

        }
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}