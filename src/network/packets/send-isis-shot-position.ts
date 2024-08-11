import { IsidaState, IsidaStateType } from "../../states/isida-state";
import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendIsisShotPositionPacket extends Packet {

    public time: number;
    public incarnation: IsidaStateType;
    public targetPosition: Vector3d;
    public shotPosition: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_ISIS_SHOT_POSITION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.incarnation = IsidaState.STATES[bytes.readShort()] as IsidaStateType;

        this.targetPosition = bytes.readVector3d();
        this.shotPosition = bytes.readVector3d();

        return {
            time: this.time,
            incarnation: this.incarnation,
            targetPosition: this.targetPosition,
            shotPosition: this.shotPosition
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeShort(IsidaState.STATES.indexOf(this.incarnation));
        bytes.writeVector3d(this.targetPosition);
        bytes.writeVector3d(this.shotPosition);

        return bytes;
    }
}