import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetWelcomeToPremiumPacket extends Packet {

    public show: boolean;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_WELCOME_TO_PREMIUM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.show = bytes.readBoolean();
        return {
            show: this.show
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeBoolean(this.show);
        return bytes;
    }
}