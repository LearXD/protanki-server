import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetNotificationEnabledPacket extends Packet {

    public enabled: boolean;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_NOTIFICATION_ENABLED, bytes)
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