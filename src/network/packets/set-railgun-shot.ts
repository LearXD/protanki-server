import { ByteArray } from "../utils/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRailgunShotPacket extends Packet {

    public shooter: string;
    public staticHitPoint: Vector3d;
    public targets: string[];
    public targetHitPoints: Vector3d[] = null;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_RAILGUN_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.staticHitPoint = bytes.readVector3d();
        this.targets = bytes.readStringArray();
        this.targetHitPoints = bytes.readVector3dArray()

        return {
            shooter: this.shooter,
            staticHitPoint: this.staticHitPoint,
            targets: this.targets,
            targetHitPoints: this.targetHitPoints
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeVector3d(this.staticHitPoint);
        bytes.writeStringArray(this.targets);
        bytes.writeVector3dArray(this.targetHitPoints);

        return bytes;
    }
}