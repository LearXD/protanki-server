import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetEmailInfoPacket extends Packet {

    public email: string;
    public confirmed: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_EMAIL_INFO, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.email = bytes.readString();
        this.confirmed = bytes.readBoolean();

        return {
            email: this.email,
            confirmed: this.confirmed
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.email);
        bytes.writeBoolean(this.confirmed);

        return bytes;
    }
}