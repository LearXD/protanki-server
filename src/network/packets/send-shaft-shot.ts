import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendShaftShotPacket extends Packet {


    public time: number
    public staticHitPoint: Vector3d
    public targets: string[]
    public targetsHitPoints: Vector3d[]
    public shorts: number[]
    public vectors_1: Vector3d[]
    public vectors_2: Vector3d[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_SHAFT_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.staticHitPoint = bytes.readVector3d();
        this.targets = bytes.readStringArray();
        this.targetsHitPoints = bytes.readVector3dArray();
        this.shorts = bytes.readArray(bytes.readShort.bind(bytes));
        this.vectors_1 = bytes.readVector3dArray();
        this.vectors_2 = bytes.readVector3dArray();

        return {
            time: this.time,
            staticHitPoint: this.staticHitPoint,
            targets: this.targets,
            targetsHitPoints: this.targetsHitPoints,
            shorts: this.shorts,
            vectors_1: this.vectors_1,
            vectors_2: this.vectors_2
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeVector3d(this.staticHitPoint);
        bytes.writeStringArray(this.targets);
        bytes.writeVector3dArray(this.targetsHitPoints);
        bytes.writeArray(this.shorts, bytes.writeShort.bind(bytes));
        bytes.writeVector3dArray(this.vectors_1);
        bytes.writeVector3dArray(this.vectors_2);

        return bytes;
    }
}