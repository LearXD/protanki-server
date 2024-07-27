import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendShowNotificationsPacket extends Packet {

    public enabled: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_SHOW_NOTIFICATIONS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.enabled = bytes.readBoolean();
        return {
            enabled: this.enabled
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeBoolean(this.enabled);
        return bytes;
    }
}