import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleNotExistPacket extends Packet {

    public battleId: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_NOT_EXIST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.battleId = bytes.readString();
        return {
            battleId: this.battleId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.battleId);
        return bytes;
    }
}