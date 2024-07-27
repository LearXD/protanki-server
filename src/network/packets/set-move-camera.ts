import { ByteArray } from "../utils/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetMoveCameraPacket extends Packet {

    public position: Vector3d;
    public orientation: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_MOVE_CAMERA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.position = bytes.readVector3d();
        this.orientation = bytes.readVector3d();

        return {
            position: this.position,
            orientation: this.orientation
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeVector3d(this.position);
        bytes.writeVector3d(this.orientation);

        return bytes;
    }
}