import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleSystemMessagePacket extends Packet {

    public message: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_SYSTEM_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.message = bytes.readString();

        return {
            message: this.message
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.message);
        return bytes;
    }
}