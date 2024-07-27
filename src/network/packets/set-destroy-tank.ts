import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetDestroyTankPacket extends Packet {

    public tank: string
    public respawnDelay: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_DESTROY_TANK, bytes)
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