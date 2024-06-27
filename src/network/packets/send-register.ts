import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRegisterPacket extends Packet {

    public username: string;
    public password: string;
    public rememberMe: boolean;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_REGISTER, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.username = bytes.readString();
        this.password = bytes.readString();
        this.rememberMe = bytes.readBoolean();

        return {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.username);
        bytes.writeString(this.password);
        bytes.writeBoolean(this.rememberMe);

        return bytes;
    }
}