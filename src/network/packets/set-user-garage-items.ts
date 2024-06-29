import { Logger } from "../../utils/logger";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserGarageItemsPacket extends Packet {

    public items: object;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_USER_GARAGE_ITEMS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const json = bytes.readString();

        try {
            this.items = JSON.parse(json);
        } catch (e) {
            Logger.error('SetUserGarageItemsPacket', e);
        }

        return {
            items: this.items
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify(this.items));
        return bytes;
    }
}