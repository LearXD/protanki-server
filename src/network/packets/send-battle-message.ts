import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendBattleMessagePacket extends Packet {

    public message: string;
    public team: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_BATTLE_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.message = bytes.readString();
        this.team = bytes.readBoolean();

        return {
            message: this.message,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.message);
        bytes.writeBoolean(this.team);
        return bytes;
    }
}