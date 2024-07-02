import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankTurretAngleControlPacket extends Packet {

    public tankId: string;
    public angle: number;
    public control: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TANK_TURRET_ANGLE_CONTROL, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.angle = bytes.readFloat();
        this.control = bytes.readByte();

        return {
            tankId: this.tankId,
            angle: this.angle,
            control: this.control
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeFloat(this.angle);
        bytes.writeByte(this.control);

        return bytes;
    }
}