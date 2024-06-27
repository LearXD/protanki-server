import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetViewingBattleDataPacket extends Packet {

    public data: string | object;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_REMOVE_VIEWING_BATTLE_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.data = bytes.readString();

        try {
            this.data = JSON.parse(this.data);
        } catch (e) {
            console.error(e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();

        if (typeof this.data === 'object') {
            this.data = JSON.stringify(this.data);
        }

        bytes.writeString(this.data);

        return bytes;
    }
}