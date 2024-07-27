import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveUserMinesPacket extends Packet {

    public ownerId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_USER_MINES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.ownerId = bytes.readString();
        return {
            ownerId: this.ownerId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.ownerId);
        return bytes;
    }
}