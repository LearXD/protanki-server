import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetOpenDailyQuestsPacket extends Packet {


    constructor(bytes: ByteArray) {
        super(Protocol.SET_OPEN_DAILY_QUESTS, bytes)
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