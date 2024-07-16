import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendShopLocationPacket extends Packet {

    public location: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_SHOP_LOCATION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.location = bytes.readString();
        return {
            location: this.location
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.location);
        return bytes;
    }
}