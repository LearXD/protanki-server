import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAddTankEffectPacket extends Packet {

    public tankId: string;
    public effectId: number;
    public duration: number;
    public activeAfterDeath: boolean;
    public effectLevel: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ADD_TANK_EFFECT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.effectId = bytes.readInt();
        this.duration = bytes.readInt();
        this.activeAfterDeath = bytes.readBoolean();
        this.effectLevel = bytes.readByte();

        return {
            tankId: this.tankId,
            effectId: this.effectId,
            duration: this.duration,
            activeAfterDeath: this.activeAfterDeath,
            effectLevel: this.effectLevel
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeInt(this.effectId);
        bytes.writeInt(this.duration);
        bytes.writeBoolean(this.activeAfterDeath);
        bytes.writeByte(this.effectLevel);

        return bytes;
    }
}