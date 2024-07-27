import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveBonusBoxPacket extends Packet {

    public bonusId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_BONUS_BOX, bytes)
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