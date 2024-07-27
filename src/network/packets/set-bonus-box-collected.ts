import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBonusBoxCollectedPacket extends Packet {

    public bonusId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BONUS_BOX_COLLECTED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.bonusId = bytes.readString();

        return {
            bonusId: this.bonusId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.bonusId);
        return bytes;
    }
}