import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAddUserOnTeamBattleCounterPacket extends Packet {

    public battle: string
    public user: string
    public team: string

    constructor(bytes: ByteArray) {
        super(Protocol.SET_ADD_USER_ON_TEAM_BATTLE_COUNTER, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();
        this.user = bytes.readString();
        this.team = Team.TEAMS[bytes.readInt()];

        return {
            battle: this.battle,
            user: this.user,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);
        bytes.writeString(this.user);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));

        return bytes;
    }
}