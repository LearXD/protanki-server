import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetDrugsDataPacket extends Packet {

    public drugs: string | object;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_DRUGS_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.drugs = bytes.readString();

        try {
            this.drugs = JSON.parse(this.drugs);
        } catch (e) {
            console.error(e);
        }

        return {
            drugs: this.drugs
        }
    }

    public encode() {
        const bytes = new ByteArray();

        if (typeof this.drugs === 'object') {
            this.drugs = JSON.stringify(this.drugs);
        }

        bytes.writeString(this.drugs);

        return bytes;
    }
}