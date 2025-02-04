import { Achievement } from "../../states/achievement";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAchievementsPacket extends Packet {

    public achievements: string[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_ACHIEVEMENTS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.achievements = new Array(length);

        for (let i = 0; i < length; i++) {
            const type = bytes.readInt();
            this.achievements[i] = Achievement.ACHIEVEMENTS[type]
        }

        return {
            achievements: this.achievements
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.achievements.length);

        for (let i = 0; i < this.achievements.length; i++) {
            const type = Achievement.ACHIEVEMENTS.indexOf(this.achievements[i])
            bytes.writeInt(type);
        }

        return bytes;
    }
}