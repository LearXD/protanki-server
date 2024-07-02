import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendMoveTankTracksPacket extends Packet {

    public int_1: number;
    public specificationId: number;
    public control: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_MOVE_TANK_TRACKS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.int_1 = bytes.readInt();
        this.specificationId = bytes.readShort();
        this.control = bytes.readByte();

        return {
            int_1: this.int_1,
            specificationId: this.specificationId,
            control: this.control
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.int_1);
        bytes.writeShort(this.specificationId);
        bytes.writeByte(this.control);

        return bytes;
    }
}