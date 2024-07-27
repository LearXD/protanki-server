import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetInviteEnabledPacket extends Packet {

    public inviteEnabled: boolean

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_INVITE_ENABLED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.inviteEnabled = bytes.readBoolean()
        return {
            inviteEnabled: this.inviteEnabled
        }
    }

    public encode() {
        const bytes = new ByteArray()
        bytes.writeBoolean(this.inviteEnabled)
        return bytes
    }
}