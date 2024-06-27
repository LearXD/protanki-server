import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendMoveTankAndTurretPacket extends Packet {

    public time: number;
    public specificationId: number;

    public angularVelocity: Vector3d;
    public control: number;
    public impulse: Vector3d;
    public orientation: Vector3d;
    public position: Vector3d;

    public turretDirection: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_MOVE_TANK_AND_TURRET, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.specificationId = bytes.readShort();

        this.angularVelocity = bytes.readVector3d();
        this.control = bytes.readByte();
        this.impulse = bytes.readVector3d();
        this.orientation = bytes.readVector3d();
        this.position = bytes.readVector3d();

        this.turretDirection = bytes.readFloat();

        return {
            time: this.time,
            specificationId: this.specificationId,
            angularVelocity: this.angularVelocity,
            control: this.control,
            impulse: this.impulse,
            orientation: this.orientation,
            position: this.position,
            turretDirection: this.turretDirection
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeShort(this.specificationId);
        bytes.writeVector3d(this.angularVelocity);
        bytes.writeByte(this.control);
        bytes.writeVector3d(this.impulse);
        bytes.writeVector3d(this.orientation);
        bytes.writeVector3d(this.position);
        bytes.writeFloat(this.turretDirection);

        return bytes;
    }
}