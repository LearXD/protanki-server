import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveBattleFromListPacket extends Packet {

    public battle: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_BATTLE_FROM_LIST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();

        return {
            battle: this.battle
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);

        return bytes;
    }
}