import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface ITargetHit {
    direction: Vector3d;
    vector_1: Vector3d;
    byte_1: number;
    target: string;
}

export class SetVulcanShotPacket extends Packet {

    public shooter: string;
    public direction: Vector3d
    public targets: ITargetHit[];

    constructor(bytes: ByteArray) {
        super(Protocol.SET_VULCAN_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.direction = bytes.readVector3d();

        const targetsLength = bytes.readInt();
        this.targets = new Array(targetsLength);

        for (let i = 0; i < targetsLength; i++) {
            this.targets[i] = {
                direction: bytes.readVector3d(),
                vector_1: bytes.readVector3d(),
                byte_1: bytes.readByte(),
                target: bytes.readString()
            }
        }

        return {
            shooter: this.shooter,
            direction: this.direction,
            targets: this.targets
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeVector3d(this.direction);

        bytes.writeInt(this.targets.length);
        this.targets.forEach(target => {
            bytes.writeVector3d(target.direction);
            bytes.writeVector3d(target.vector_1);
            bytes.writeByte(target.byte_1);
            bytes.writeString(target.target);
        })

        return bytes;
    }
}