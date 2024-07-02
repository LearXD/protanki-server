import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleMessagePacket extends Packet {

    public userId: string;
    public message: string;
    public team: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_MESSAGE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();
        this.message = bytes.readString();
        this.team = Team.TEAMS[bytes.readInt()];

        return {
            userId: this.userId,
            message: this.message,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.userId);
        bytes.writeString(this.message);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));

        return bytes;
    }
}