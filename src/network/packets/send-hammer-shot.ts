import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface ITarget {
    hitPosition: Vector3d;
    orientation: Vector3d;
    targetPosition: Vector3d;
    target: string;
    turretAngle: number;
}

export class SendHammerShotPacket extends Packet {

    public time: number;
    public direction: Vector3d;
    public targets: ITarget[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_HAMMER_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.direction = bytes.readVector3d();

        const targetsLength = bytes.readInt();
        this.targets = new Array(targetsLength);

        for (let i = 0; i < targetsLength; i++) {
            this.targets[i] = {
                hitPosition: bytes.readVector3d(),
                orientation: bytes.readVector3d(),
                targetPosition: bytes.readVector3d(),
                target: bytes.readString(),
                turretAngle: bytes.readFloat()
            }
        }

        return {
            time: this.time,
            direction: this.direction,
            targets: this.targets
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeVector3d(this.direction);

        bytes.writeInt(this.targets.length);
        this.targets.forEach((target) => {
            bytes.writeVector3d(target.hitPosition);
            bytes.writeVector3d(target.orientation);
            bytes.writeVector3d(target.targetPosition);
            bytes.writeString(target.target);
            bytes.writeFloat(target.turretAngle);
        })

        return bytes;
    }
}