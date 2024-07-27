import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSmokyTargetShotPacket extends Packet {

    public shooter: string;
    public target: string;
    public hitPoint: Vector3d;
    public weakeningCoeff: number;
    public isCritical: boolean;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SMOKY_TARGET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.target = bytes.readString();
        this.hitPoint = bytes.readVector3d();
        this.weakeningCoeff = bytes.readFloat();
        this.isCritical = bytes.readBoolean();

        return {
            shooter: this.shooter,
            target: this.target,
            hitPoint: this.hitPoint,
            weakeningCoeff: this.weakeningCoeff,
            isCritical: this.isCritical
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeString(this.target);
        bytes.writeVector3d(this.hitPoint);
        bytes.writeFloat(this.weakeningCoeff);
        bytes.writeBoolean(this.isCritical);

        return bytes;
    }
}