import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankVisiblePacket extends Packet {

    public tankId: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TANK_VISIBLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();

        return {
            tankId: this.tankId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);

        return bytes;
    }
}