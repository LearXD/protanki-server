import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetInvalidEquipmentForBattlePacket extends Packet {

    public battleId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_INVALID_EQUIPMENT_FOR_BATTLE, bytes)
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