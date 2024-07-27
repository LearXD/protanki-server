import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetShopCorrectPromotionalCodePacket extends Packet {


    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SHOP_CORRECT_PROMOTIONAL_CODE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        return {

        }
    }

    public encode() {
        const bytes = new ByteArray();
        return bytes;
    }
}