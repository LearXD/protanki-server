import { ByteArray } from "../utils/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetShaftLocalSpotPacket extends Packet {

    public shooter: string;
    public target: string;
    public position: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SHAFT_LOCAL_SPOT, bytes)
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