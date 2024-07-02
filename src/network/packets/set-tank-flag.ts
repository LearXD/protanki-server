import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTankFlagPacket extends Packet {

    public tankId: string
    public flagTeam: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TANK_FLAG, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.flagTeam = Team.TEAMS[bytes.readInt()];

        return {
            tankId: this.tankId,
            flagTeam: this.flagTeam
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeInt(Team.TEAMS.indexOf(this.flagTeam));

        return bytes;
    }
}