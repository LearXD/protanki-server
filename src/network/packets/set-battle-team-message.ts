import { Team, TeamType } from "../../states/team";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleTeamMessagePacket extends Packet {

    public userId: string
    public message: string
    public team: TeamType

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_TEAM_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();
        this.message = bytes.readString();
        this.team = Team.TEAMS[bytes.readInt()] as TeamType;

        return {
            userId: this.userId,
            message: this.message,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.userId);
        bytes.writeString(this.message);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));
        return bytes;
    }
}