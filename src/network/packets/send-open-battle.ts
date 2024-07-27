import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendOpenBattlePacket extends Packet {

    public battleId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_OPEN_BATTLE, bytes)
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