import { ByteArray } from "../../utils/network/byte-array";
import { Team } from "../../utils/game/team";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSpawnTankPacket extends Packet {

    public tankId: string;
    public team: string;
    public position: Vector3d
    public orientation: Vector3d;
    public health: number;
    public incarnationId: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SPAWN_TANK, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.team = Team.TEAMS[bytes.readInt()];
        this.position = bytes.readVector3d();
        this.orientation = bytes.readVector3d();
        // Pode bugar
        this.health = bytes.readShort();
        this.incarnationId = bytes.readShort();

        return {
            tankId: this.tankId,
            team: this.team,
            position: this.position,
            orientation: this.orientation,
            health: this.health,
            incarnationId: this.incarnationId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeInt(Team.TEAMS.indexOf(this.team));
        bytes.writeVector3d(this.position);
        bytes.writeVector3d(this.orientation);
        bytes.writeShort(this.health);
        bytes.writeShort(this.incarnationId);

        return bytes;
    }
}