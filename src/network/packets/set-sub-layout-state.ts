import { LayoutState } from "../../states/layout-state";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSubLayoutStatePacket extends Packet {

    public principal: string
    public secondary: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SUB_LAYOUT_STATE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const principal = bytes.readInt()
        this.principal = LayoutState.STATES[principal]

        const secondary = bytes.readInt()
        this.secondary = LayoutState.STATES[secondary]

        return {
            principal: this.principal,
            secondary: this.secondary
        }
    }

    public encode() {
        const bytes = new ByteArray();

        const principal = LayoutState.STATES.indexOf(this.principal)
        bytes.writeInt(principal)

        const secondary = LayoutState.STATES.indexOf(this.secondary)
        bytes.writeInt(secondary)

        return bytes;
    }
}