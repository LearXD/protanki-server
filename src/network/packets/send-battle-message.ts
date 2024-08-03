import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBattleMessagePacket extends Packet {

    public message: string;
    public private: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BATTLE_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.message = bytes.readString();
        this.private = bytes.readBoolean();

        return {
            message: this.message,
            private: this.private
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.message);
        bytes.writeBoolean(this.private);
        return bytes;
    }
}