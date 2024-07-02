import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetShaftShotPacket extends Packet {

    public shooter: string;
    public staticHitPoint: Vector3d;
    public targets: string[];
    public targetHitPoints: Vector3d[] = null;
    public impactForce: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SHAFT_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.staticHitPoint = bytes.readVector3d();
        this.targets = bytes.readStringArray();

        if (!bytes.readBoolean()) {
            const hitPointsLength = bytes.readInt();
            this.targetHitPoints = new Array(hitPointsLength);

            for (let i = 0; i < hitPointsLength; i++) {
                this.targetHitPoints[i] = bytes.readVector3d();
            }
        }

        this.impactForce = bytes.readFloat();

        return {
            shooter: this.shooter,
            staticHitPoint: this.staticHitPoint,
            targets: this.targets,
            targetHitPoints: this.targetHitPoints,
            impactForce: this.impactForce
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeVector3d(this.staticHitPoint);
        bytes.writeStringArray(this.targets);

        if (this.targetHitPoints === null) {
            bytes.writeBoolean(true);
        } else {
            bytes.writeBoolean(false);

            bytes.writeInt(this.targetHitPoints.length);

            for (let i = 0; i < this.targetHitPoints.length; i++) {
                bytes.writeVector3d(this.targetHitPoints[i]);
            }
        }

        bytes.writeFloat(this.impactForce);

        return bytes;
    }
}