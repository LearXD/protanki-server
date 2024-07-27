import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetMoveTankPacket extends Packet {

    public tankId: string;

    public angularVelocity: Vector3d;
    public control: number;
    public impulse: Vector3d;
    public orientation: Vector3d;
    public position: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_MOVE_TANK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.angularVelocity = bytes.readVector3d();
        this.control = bytes.readByte();
        this.impulse = bytes.readVector3d();
        this.orientation = bytes.readVector3d();
        this.position = bytes.readVector3d();

        return {
            tankId: this.tankId,
            angularVelocity: this.angularVelocity,
            control: this.control,
            impulse: this.impulse,
            orientation: this.orientation,
            position: this.position
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeVector3d(this.angularVelocity);
        bytes.writeByte(this.control);
        bytes.writeVector3d(this.impulse);
        bytes.writeVector3d(this.orientation);
        bytes.writeVector3d(this.position);

        return bytes;
    }
}