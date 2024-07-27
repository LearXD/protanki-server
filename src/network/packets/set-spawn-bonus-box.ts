import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSpawnBonusBoxPacket extends Packet {

    public bonusId: string;
    public position: Vector3d;
    public int_1: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SPAWN_BONUS_BOX, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.bonusId = bytes.readString();
        this.position = bytes.readVector3d();
        this.int_1 = bytes.readInt();

        return {
            bonusId: this.bonusId,
            position: this.position,
            int_1: this.int_1
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.bonusId);
        bytes.writeVector3d(this.position);
        bytes.writeInt(this.int_1);

        return bytes;
    }
}