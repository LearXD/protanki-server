import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTeamScorePacket extends Packet {

    public team: string
    public score: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_TEAM_SCORE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.team = Team.TEAMS[bytes.readInt()];
        this.score = bytes.readInt();

        return {
            team: this.team,
            score: this.score
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(Team.TEAMS.indexOf(this.team));
        bytes.writeInt(this.score);

        return bytes;
    }
}