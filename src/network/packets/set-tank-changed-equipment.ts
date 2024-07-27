import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankChangedEquipmentPacket extends Packet {

    public tankId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TANK_CHANGED_EQUIPMENT, bytes)
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