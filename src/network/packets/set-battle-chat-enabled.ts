import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleChatEnabledPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_CHAT_ENABLED, bytes)
    }

    public decode() {
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}