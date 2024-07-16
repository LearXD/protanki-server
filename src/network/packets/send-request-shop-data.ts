import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRequestShopDataPacket extends Packet {

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_REQUEST_SHOP_DATA, bytes)
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