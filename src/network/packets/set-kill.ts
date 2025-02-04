import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetKillPacket extends Packet {

    public tankId: string;
    public killerId: string;
    public respawnDelay: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_KILL_PACKET, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.killerId = bytes.readString();
        this.respawnDelay = bytes.readInt();

        return {
            tankId: this.tankId,
            killerId: this.killerId,
            respawnDelay: this.respawnDelay
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeString(this.killerId);
        bytes.writeInt(this.respawnDelay);

        return bytes;
    }
}