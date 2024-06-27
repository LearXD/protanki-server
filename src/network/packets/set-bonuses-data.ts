import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBonusesDataPacket extends Packet {

    public bonuses: string | object;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BONUSES_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.bonuses = bytes.readString();

        try {
            this.bonuses = JSON.parse(this.bonuses);
        } catch (e) {
            console.error(e);
        }

        return {
            bonuses: this.bonuses
        }
    }

    public encode() {
        const bytes = new ByteArray();

        if (typeof this.bonuses === 'object') {
            this.bonuses = JSON.stringify(this.bonuses);
        }

        bytes.writeString(this.bonuses);

        return bytes;
    }
}