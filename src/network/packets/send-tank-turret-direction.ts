import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendTankTurretDirectionPacket extends Packet {

    public time: number;
    public angle: number;
    public control: number;
    public incarnationId: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_TANK_TURRET_DIRECTION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.time = bytes.readInt();
        this.angle = bytes.readFloat();
        this.control = bytes.readByte();
        this.incarnationId = bytes.readShort();

        return {
            time: this.time,
            angle: this.angle,
            control: this.control,
            incarnationId: this.incarnationId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.time);
        bytes.writeFloat(this.angle);
        bytes.writeByte(this.control);
        bytes.writeShort(this.incarnationId);

        return bytes;
    }
}