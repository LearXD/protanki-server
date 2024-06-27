import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

// parar
// frente
// trás
//

export class SetTankControlPacket extends Packet {

    public tankId: string;
    public control: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TANK_CONTROL, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tankId = bytes.readString();
        this.control = bytes.readByte();

        return {
            tankId: this.tankId,
            control: this.control
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tankId);
        bytes.writeByte(this.control);

        return bytes;
    }
}