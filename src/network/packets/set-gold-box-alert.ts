import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetGoldBoxAlertPacket extends Packet {

    public text: string;
    public sound: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_GOLD_BOX_ALERT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.text = bytes.readString();
        this.sound = bytes.readInt();
        return {
            text: this.text,
            sound: this.sound
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.text);
        bytes.writeInt(this.sound);
        return bytes;
    }
}