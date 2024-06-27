import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetEquipGarageItemPacket extends Packet {

    public itemId: string;
    public equipped: boolean;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_EQUIP_GARAGE_ITEM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.itemId = bytes.readString();
        this.equipped = bytes.readBoolean();

        return {
            itemId: this.itemId,
            equipped: this.equipped
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.itemId);
        bytes.writeBoolean(this.equipped);
        return bytes;
    }
}