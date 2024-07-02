import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveTankEffectPacket extends Packet {

    public tankId: string;
    public effectId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_TANK_EFFECT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.effectId = bytes.readInt();

        return {
            tankId: this.tankId,
            effectId: this.effectId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeInt(this.effectId);

        return bytes;
    }
}