import { IsidaState } from "../../utils/game/isida-state";
import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface ITarget {
    direction: Vector3d;
    position: Vector3d;
    byte_1: number;
    target: string;
}

export class SetIsisShotPositionPacket extends Packet {

    public shooter: string;
    public state: string;
    public target: ITarget;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ISIS_SHOT_POSITION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.state = IsidaState.STATES[bytes.readInt()];
        this.target = {
            direction: bytes.readVector3d(),
            position: bytes.readVector3d(),
            byte_1: bytes.readByte(),
            target: bytes.readString()
        }

        return {
            shooter: this.shooter,
            state: this.state,
            target: this.target
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeInt(IsidaState.STATES.indexOf(this.state));

        bytes.writeVector3d(this.target.direction);
        bytes.writeVector3d(this.target.position);
        bytes.writeByte(this.target.byte_1);
        bytes.writeString(this.target.target);

        return bytes;
    }
}