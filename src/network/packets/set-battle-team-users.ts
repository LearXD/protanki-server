import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IStat {
    deaths: number
    kills: number
    score: number
    user: string
}

export class SetBattleTeamUsersPacket extends Packet {

    public red: IStat[]
    public blue: IStat[]

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_TEAM_USERS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const redLength = bytes.readInt();
        this.red = new Array(redLength);

        for (let i = 0; i < redLength; i++) {
            this.red[i] = {
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                score: bytes.readInt(),
                user: bytes.readString(),
            }
        }

        const blueLength = bytes.readInt();
        this.blue = new Array(blueLength);

        for (let i = 0; i < blueLength; i++) {
            this.blue[i] = {
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                score: bytes.readInt(),
                user: bytes.readString(),
            }
        }

        return {
            red: this.red,
            blue: this.blue
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.red.length);
        this.red.forEach(stat => {
            bytes.writeInt(stat.deaths);
            bytes.writeInt(stat.kills);
            bytes.writeInt(stat.score);
            bytes.writeString(stat.user);
        })

        bytes.writeInt(this.blue.length);
        this.blue.forEach(stat => {
            bytes.writeInt(stat.deaths);
            bytes.writeInt(stat.kills);
            bytes.writeInt(stat.score);
            bytes.writeString(stat.user);
        })

        return bytes;
    }
}