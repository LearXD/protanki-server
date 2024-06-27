import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetShooterTankSpotPacket extends Packet {

    public shooter: string;
    public target: string;
    public position: Vector3d;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_SHOOTER_TANK_SPOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.target = bytes.readString();
        this.position = bytes.readVector3d();

        return {
            shooter: this.shooter,
            target: this.target,
            position: this.position
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeString(this.target);
        bytes.writeVector3d(this.position);

        return bytes;
    }
}