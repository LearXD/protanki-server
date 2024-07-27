import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankSpeedPacket extends Packet {

    public tankId: string;
    public maxSpeed: number;
    public maxTurnSpeed: number;
    public maxTurretRotationSpeed: number;
    public acceleration: number;
    public specificationId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TANK_SPEED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.maxSpeed = bytes.readFloat();
        this.maxTurnSpeed = bytes.readFloat();
        this.maxTurretRotationSpeed = bytes.readFloat();
        this.acceleration = bytes.readFloat();

        // Talvez quebre
        this.specificationId = bytes.readShort();

        return {
            tankId: this.tankId,
            maxSpeed: this.maxSpeed,
            maxTurnSpeed: this.maxTurnSpeed,
            maxTurretRotationSpeed: this.maxTurretRotationSpeed,
            acceleration: this.acceleration,
            specificationId: this.specificationId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeFloat(this.maxSpeed);
        bytes.writeFloat(this.maxTurnSpeed);
        bytes.writeFloat(this.maxTurretRotationSpeed);
        bytes.writeFloat(this.acceleration);
        bytes.writeShort(this.specificationId);

        return bytes;
    }
}