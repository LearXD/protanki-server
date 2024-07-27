import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendRicochetShotPacket extends Packet {

    public time: number;
    public shotId: number;

    public shotDirectionX: number;
    public shotDirectionY: number;
    public shotDirectionZ: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_RICOCHET_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.shotId = bytes.readInt();

        this.shotDirectionX = bytes.readShort();
        this.shotDirectionY = bytes.readShort();
        this.shotDirectionZ = bytes.readShort();

        return {
            time: this.time,
            shotId: this.shotId,
            shotDirectionX: this.shotDirectionX,
            shotDirectionY: this.shotDirectionY,
            shotDirectionZ: this.shotDirectionZ
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeInt(this.shotId);

        bytes.writeShort(this.shotDirectionX);
        bytes.writeShort(this.shotDirectionY);
        bytes.writeShort(this.shotDirectionZ);

        return bytes;
    }
}