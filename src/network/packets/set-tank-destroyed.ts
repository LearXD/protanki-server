import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankDestroyedPacket extends Packet {

    public tankId: string;
    public killerId: string;
    public respawnDelay: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TANK_DESTROYED, bytes)
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