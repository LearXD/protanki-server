import { IsidaState, IsidaStateType } from "../../states/isida-state";
import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendIsisShotPositionPacket extends Packet {

    public time: number;
    public type: IsidaStateType;

    public destinationPosition: Vector3d;
    public targetPosition: Vector3d;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_ISIS_SHOT_POSITION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.type = IsidaState.STATES[bytes.readShort()] as IsidaStateType;

        this.destinationPosition = bytes.readVector3d();
        this.targetPosition = bytes.readVector3d();

        return {
            time: this.time,
            type: this.type,
            destinationPosition: this.destinationPosition,
            targetPosition: this.targetPosition
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeShort(IsidaState.STATES.indexOf(this.type));
        bytes.writeVector3d(this.destinationPosition);
        bytes.writeVector3d(this.targetPosition);

        return bytes;
    }
}