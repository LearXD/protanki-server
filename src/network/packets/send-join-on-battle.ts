import { ByteArray } from "../utils/byte-array";
import { Team, TeamType } from "../../states/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendJoinOnBattlePacket extends Packet {

    public team: TeamType;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_JOIN_ON_BATTLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.team = Team.TEAMS[bytes.readInt()] as TeamType;

        return {
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(Team.TEAMS.indexOf(this.team));
        return bytes;
    }
}