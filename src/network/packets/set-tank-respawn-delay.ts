import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankRespawnDelayPacket extends Packet {

    public tank: string
    public respawnDelay: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TANK_RESPAWN_DELAY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tank = bytes.readString();
        this.respawnDelay = bytes.readInt();

        return {
            tank: this.tank,
            respawnDelay: this.respawnDelay
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.tank);
        bytes.writeInt(this.respawnDelay);
        return bytes;
    }
}