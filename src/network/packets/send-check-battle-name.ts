import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendCheckBattleNamePacket extends Packet {

    public battleName: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_CHECK_BATTLE_NAME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battleName = bytes.readString();

        return {
            battleName: this.battleName
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.battleName)
        return bytes;
    }
}