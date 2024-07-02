import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBattleMessagePacket extends Packet {

    public message: string;
    public broadcast: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BATTLE_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.message = bytes.readString();
        this.broadcast = bytes.readBoolean();

        return {
            message: this.message,
            broadcast: this.broadcast
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.message);
        bytes.writeBoolean(this.broadcast);
        return bytes;
    }
}