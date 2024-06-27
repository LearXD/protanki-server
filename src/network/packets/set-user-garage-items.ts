import Logger from "../../utils/logger";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserGarageItemsPacket extends Packet {

    public items: string | object;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_USER_GARAGE_ITEMS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.items = bytes.readString();

        try {
            this.items = JSON.parse(this.items);
        } catch (e) {
            Logger.error('SetUserGarageItemsPacket', e);
        }

        return {
            items: this.items
        }
    }

    public encode() {
        const bytes = new ByteArray();
        if (typeof this.items === 'object') {
            this.items = JSON.stringify(this.items);
        }
        bytes.writeString(this.items as string);
        return bytes;
    }
}