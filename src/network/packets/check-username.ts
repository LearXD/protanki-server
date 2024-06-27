import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class CheckUsernamePacket extends Packet {

    public username: string;

    constructor(bytes: ByteArray) {
        super(Protocol.CHECK_USERNAME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.username = bytes.readString();

        return {
            username: this.username
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.username);
        return bytes;
    }
}