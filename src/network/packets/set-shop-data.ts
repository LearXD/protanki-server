import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetShopDataPacket extends Packet {

    private data: any

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SHOP_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.data = JSON.parse(json);
        } catch (e) {
            console.error("Error parsing JSON", e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();
        try {
            bytes.writeString(JSON.stringify(this.data));
        } catch (e) {
            console.error("Error encoding JSON", e);
        }
        return bytes;
    }
}