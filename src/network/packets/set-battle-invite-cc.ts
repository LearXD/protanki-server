import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleInviteCCPacket extends Packet {

    public resourceId: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_INVITE_CC, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.resourceId = bytes.readInt();

        return {
            resourceId: this.resourceId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.resourceId);

        return bytes;
    }
}