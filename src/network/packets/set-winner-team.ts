import { ByteArray } from "../utils/byte-array";
import { Team } from "../../states/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetWinnerTeamPacket extends Packet {

    public winnerTeam: string
    public delivererTankId: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_WINNER_TEAM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.winnerTeam = Team.TEAMS[bytes.readInt()];
        this.delivererTankId = bytes.readString();

        return {
            winnerTeam: this.winnerTeam,
            delivererTankId: this.delivererTankId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(Team.TEAMS.indexOf(this.winnerTeam));
        bytes.writeString(this.delivererTankId);

        return bytes;
    }
}