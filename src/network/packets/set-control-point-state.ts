import { ControlPointState } from "../../utils/game/control-point-state";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetControlPointStatePacket extends Packet {

    public pointId: number
    public state: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CONTROL_POINT_STATE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.pointId = bytes.readInt();
        this.state = ControlPointState.STATES[bytes.readInt()];

        return {
            pointId: this.pointId,
            state: this.state
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.pointId);
        bytes.writeInt(ControlPointState.STATES.indexOf(this.state));
        return bytes;
    }
}