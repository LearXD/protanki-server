import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSmokyHitPointPacket extends Packet {

    public shooter: string;
    public hitPoint: Vector3d;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_SMOKY_HIT_POINT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.hitPoint = bytes.readVector3d();

        return {
            shooter: this.shooter,
            hitPoint: this.hitPoint
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeVector3d(this.hitPoint);

        return bytes;
    }
}