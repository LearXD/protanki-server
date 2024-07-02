import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendFlameTargetsShotPacket extends Packet {

    public time: number;
    public targets: string[];
    public incarnations: number[];
    public targetsPositions: Vector3d[]
    public vectors_2: Vector3d[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_FLAME_TARGETS_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.targets = bytes.readStringArray();
        this.incarnations = bytes.readArray(bytes.readShort.bind(bytes))
        this.targetsPositions = bytes.readArray(bytes.readVector3d.bind(bytes))
        this.vectors_2 = bytes.readArray(bytes.readVector3d.bind(bytes))

        return {
            time: this.time,
            targets: this.targets,
            incarnations: this.incarnations,
            targetsPositions: this.targetsPositions,
            vectors_2: this.vectors_2
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeStringArray(this.targets);

        bytes.writeArray(this.incarnations, bytes.writeShort.bind(bytes))
        bytes.writeArray(this.targetsPositions, bytes.writeVector3d.bind(bytes))
        bytes.writeArray(this.vectors_2, bytes.writeVector3d.bind(bytes))

        return bytes;
    }
}