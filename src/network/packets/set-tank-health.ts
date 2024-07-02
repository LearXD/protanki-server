import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankHealthPacket extends Packet {

    public tankId: string;
    public health: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TANK_HEALTH, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.health = bytes.readFloat();

        return {
            tankId: this.tankId,
            health: this.health
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeFloat(this.health);

        return bytes;
    }
}