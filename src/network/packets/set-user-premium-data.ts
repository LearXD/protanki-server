import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserPremiumDataPacket extends Packet {

    public premiumTimeLeftInSeconds: number
    public user: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_PREMIUM_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.premiumTimeLeftInSeconds = bytes.readInt();
        this.user = bytes.readString();

        return {
            premiumTimeLeftInSeconds: this.premiumTimeLeftInSeconds,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.premiumTimeLeftInSeconds);
        bytes.writeString(this.user);

        return bytes;
    }
}