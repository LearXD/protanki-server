import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetWelcomeToPremiumPacket extends Packet {

    public renew: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_WELCOME_TO_PREMIUM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.renew = bytes.readBoolean();
        return {
            renew: this.renew
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeBoolean(this.renew);
        return bytes;
    }
}