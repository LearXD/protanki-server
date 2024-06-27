import { Team } from "../../utils/game/team";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTeamStoppedCapturingControlPointPacketPacket extends Packet {

    public team: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TEAM_STOPPED_CAPTURING_CONTROL_POINT_PACKET, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.team = Team.TEAMS[bytes.readInt()];

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