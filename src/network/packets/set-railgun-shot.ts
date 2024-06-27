import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRailgunShotPacket extends Packet {

    public shooter: string;
    public staticHitPoint: Vector3d;
    public targets: string[];
    public targetHitPoints: Vector3d[] = null;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_RAILGUN_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.staticHitPoint = bytes.readVector3d();
        this.targets = bytes.readStringArray();

        if (!bytes.readBoolean()) {
            const targetHitPointsLength = bytes.readInt();

            this.targetHitPoints = new Array(targetHitPointsLength);

            for (let i = 0; i < targetHitPointsLength; i++) {
                this.targetHitPoints[i] = bytes.readVector3d();
            }
        }

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

        if (this.targetHitPoints != null) {
            bytes.writeInt(this.targetHitPoints.length);
            bytes.writeBoolean(false);

            for (const targetHitPoint of this.targetHitPoints) {
                bytes.writeVector3d(targetHitPoint);
            }
        } else {
            bytes.writeBoolean(true);
        }

        return bytes;
    }
}