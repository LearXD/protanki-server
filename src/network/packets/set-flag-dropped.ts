import { Team } from "../../utils/game/team";
import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetFlagDroppedPacket extends Packet {

    public position: Vector3d;
    public team: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_FLAG_DROPPED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.position = bytes.readVector3d();
        this.team = Team.TEAMS[bytes.readInt()];

        return {
            position: this.position,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeVector3d(this.position);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));

        return bytes;
    }
}