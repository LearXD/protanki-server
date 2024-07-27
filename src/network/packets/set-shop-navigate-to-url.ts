import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetShopNavigateToUrlPacket extends Packet {

    public url: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SHOP_NAVIGATE_TO_URL, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.url = bytes.readString();
        return {
            url: this.url
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.url);
        return bytes;
    }
}