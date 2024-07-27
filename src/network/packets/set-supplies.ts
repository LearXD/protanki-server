import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface ISupply {
    id: string;
    count: number;
    slotId: number;
    itemEffectTime: number;
    itemRestSec: number;
}

export class SetSuppliesPacket extends Packet {

    public supplies: ISupply[] = [];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SUPPLIES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.supplies = JSON.parse(json).items;
        } catch (e) {
            console.error(e);
        }

        return {
            supplies: this.supplies
        }
    }

    public encode() {
        const bytes = new ByteArray();

        try {
            bytes.writeString(JSON.stringify({
                items: this.supplies
            }));
        } catch (e) {
            console.error(e);
        }

        return bytes;
    }
}