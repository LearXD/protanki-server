import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

// TODO: Aqui começa a animação de captura
export class SetTankCapturingControlPointPacket extends Packet {

    public pointId: number
    public tankId: string

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TANK_CAPTURING_CONTROL_POINT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.pointId = bytes.readInt();
        this.tankId = bytes.readString();

        return {
            pointId: this.pointId,
            tankId: this.tankId
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.pointId);
        bytes.writeString(this.tankId);
        return bytes;
    }
}