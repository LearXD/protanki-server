import { LayoutState } from "../../utils/game/layout-state";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendSetLayoutStatePacket extends Packet {

    public layoutState: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_SET_LAYOUT_STATE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.layoutState = LayoutState.STATES[bytes.readInt()];

        return {
            layoutState: this.layoutState
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(LayoutState.STATES.indexOf(this.layoutState));
        return bytes;
    }
}