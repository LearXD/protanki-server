import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleSwapTeamsPacket extends Packet {

    public battle: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_SWAP_TEAMS, bytes)
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