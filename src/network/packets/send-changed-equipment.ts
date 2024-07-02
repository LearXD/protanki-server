import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendChangedEquipmentPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_CHANGED_EQUIPMENT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {}
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}