import { LayoutState } from "../../states/layout-state";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendLayoutStatePacket extends Packet {

    public state: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_LAYOUT_STATE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.state = LayoutState.STATES[bytes.readInt()];

        return {
            state: this.state
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(LayoutState.STATES.indexOf(this.state));
        return bytes;
    }
}