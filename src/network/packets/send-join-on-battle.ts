import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendJoinOnBattlePacket extends Packet {

    public team: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_JOIN_ON_BATTLE, bytes)
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