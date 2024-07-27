import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAutoDestroyPacket extends Packet {

    public tankId: string;
    public respawnDelay: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_AUTO_DESTROY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.respawnDelay = bytes.readInt();

        return {
            tankId: this.tankId,
            respawnDelay: this.respawnDelay
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId)
        bytes.writeInt(this.respawnDelay)

        return bytes;
    }
}