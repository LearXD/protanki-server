import { Team } from "../../utils/game/team";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAddUserInfoOnViewingTeamBattlePacket extends Packet {

    public battleId: string

    public kills: number
    public score: number
    public suspicious: boolean
    public user: string

    public team: string

    constructor(bytes: ByteArray) {
        super(Protocol.SET_ADD_USER_INFO_ON_VIEWING_TEAM_BATTLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battleId = bytes.readString();

        this.kills = bytes.readInt();
        this.score = bytes.readInt();
        this.suspicious = bytes.readBoolean();
        this.user = bytes.readString();

        this.team = Team.TEAMS[bytes.readInt()];

        return {
            battleId: this.battleId,
            kills: this.kills,
            score: this.score,
            suspicious: this.suspicious,
            user: this.user,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battleId);

        bytes.writeInt(this.kills);
        bytes.writeInt(this.score);
        bytes.writeBoolean(this.suspicious);
        bytes.writeString(this.user);

        bytes.writeInt(Team.TEAMS.indexOf(this.team));

        return bytes;
    }
}