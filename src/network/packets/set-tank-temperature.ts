import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankTemperaturePacket extends Packet {

    public tankId: string;
    public temperature: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TANK_TEMPERATURE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.temperature = bytes.readFloat();

        return {
            tankId: this.tankId,
            temperature: this.temperature
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeFloat(this.temperature);

        return bytes;
    }
}