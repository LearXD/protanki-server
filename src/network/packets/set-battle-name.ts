import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleNamePacket extends Packet {

    public battleName: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_NAME, bytes)
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