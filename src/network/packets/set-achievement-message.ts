import { Achievement } from "../../utils/game/achievement";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

// TODO: Usado pra mostrar aquele presente quando compra dima pela primeira vez ou verifica email
export class SetAchievementMessagePacket extends Packet {

    public achievement: string
    public message: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ACHIEVEMENT_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.achievement = Achievement.ACHIEVEMENTS[bytes.readInt()];
        this.message = bytes.readString();

        return {
            achievement: this.achievement,
            message: this.message
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(Achievement.ACHIEVEMENTS.indexOf(this.achievement));
        bytes.writeString(this.message);

        return bytes;
    }
}