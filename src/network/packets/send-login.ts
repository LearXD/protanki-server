import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendLoginPacket extends Packet {

    public username: string;
    public password: string;
    public remember: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_LOGIN, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.username = bytes.readString();
        this.password = bytes.readString();
        this.remember = bytes.readBoolean();

        return {
            username: this.username,
            password: this.password,
            remember: this.remember
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.username);
        bytes.writeString(this.password);
        bytes.writeBoolean(this.remember);

        return bytes;
    }
}