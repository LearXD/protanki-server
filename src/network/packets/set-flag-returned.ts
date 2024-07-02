import { Team } from "../../utils/game/team";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetFlagReturnedPacket extends Packet {

    public team: string;
    public tank: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_FLAG_RETURNED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.team = Team.TEAMS[bytes.readInt()];
        this.tank = bytes.readString();

        return {
            team: this.team,
            tank: this.tank
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(Team.TEAMS.indexOf(this.team));
        bytes.writeString(this.tank);

        return bytes;
    }
}