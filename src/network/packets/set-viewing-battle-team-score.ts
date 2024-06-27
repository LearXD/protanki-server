import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetViewingBattleTeamScorePacket extends Packet {

    public battle: string
    public team: string
    public score: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_VIEWING_BATTLE_TEAM_SCORE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();
        this.team = Team.TEAMS[bytes.readInt()];
        this.score = bytes.readInt();

        return {
            battle: this.battle,
            team: this.team,
            score: this.score
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));
        bytes.writeInt(this.score);

        return bytes;
    }
}