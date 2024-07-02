import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IUser {
    deaths: number;
    kills: number;
    score: number;
    name: string;
}

export class SetTeamBattleUserStatPacket extends Packet {

    public user: IUser
    public team: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_TEAM_BATTLE_USER_START, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.user = {
            deaths: bytes.readInt(),
            kills: bytes.readInt(),
            score: bytes.readInt(),
            name: bytes.readString()
        }

        this.team = Team.TEAMS[bytes.readInt()];

        return {
            user: this.user,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.user.deaths);
        bytes.writeInt(this.user.kills);
        bytes.writeInt(this.user.score);
        bytes.writeString(this.user.name);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));

        return bytes;
    }
}