import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IStat {
    deaths: number
    kills: number
    score: number
    user: string
}

export class SetBattleUsersStatPacket extends Packet {

    public stats: any[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_USERS_STAT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.stats = new Array(length);

        for (let i = 0; i < length; i++) {
            this.stats[i] = {
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                score: bytes.readInt(),
                user: bytes.readString(),
            }
        }

        return {
            stats: this.stats
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.stats.length);
        this.stats.forEach(stat => {
            bytes.writeInt(stat.deaths);
            bytes.writeInt(stat.kills);
            bytes.writeInt(stat.score);
            bytes.writeString(stat.user);
        })
        return bytes;
    }
}