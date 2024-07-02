import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRicochetShotPacket extends Packet {

    public shooter: string;
    public shotDirectionX: number;
    public shotDirectionY: number;
    public shotDirectionZ: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_RICOCHET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();
        this.shotDirectionX = bytes.readShort();
        this.shotDirectionY = bytes.readShort();
        this.shotDirectionZ = bytes.readShort();

        return {
            shooter: this.shooter,
            shotDirectionX: this.shotDirectionX,
            shotDirectionY: this.shotDirectionY,
            shotDirectionZ: this.shotDirectionZ
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);
        bytes.writeShort(this.shotDirectionX);
        bytes.writeShort(this.shotDirectionY);
        bytes.writeShort(this.shotDirectionZ);

        return bytes;
    }
}