import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetLayoutStatePacket extends Packet {

    public static readonly states = [
        'BATTLE_SELECT',
        'GARAGE',
        'PAYMENT',
        'BATTLE',
        'RELOAD_SPACE'
    ]

    public state: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LAYOUT_STATE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const state = bytes.readInt()
        this.state = SetLayoutStatePacket.states[state]

        return {
            state: this.state
        }
    }

    public encode() {
        const bytes = new ByteArray();

        const state = SetLayoutStatePacket.states.indexOf(this.state)
        bytes.writeInt(state)

        return bytes;
    }
}