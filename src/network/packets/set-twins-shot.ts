import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTwinsShotPacket extends Packet {

    public shooter: string;
    public barrel: number;
    public shotId: number;
    public shotDirection: Vector3d;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TWINS_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.barrel = bytes.readByte();
        this.shotId = bytes.readInt();
        this.shotDirection = bytes.readVector3d();

        return {
            shooter: this.shooter,
            barrel: this.barrel,
            shotId: this.shotId,
            shotDirection: this.shotDirection
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeByte(this.barrel);
        bytes.writeInt(this.shotId);
        bytes.writeVector3d(this.shotDirection);

        return bytes;
    }
}