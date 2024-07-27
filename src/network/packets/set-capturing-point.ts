import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCapturingPointPacket extends Packet {

    public point: number;
    public progress: number;
    public speed: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CAPTURING_POINT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.point = bytes.readInt();
        this.progress = bytes.readFloat();
        this.speed = bytes.readFloat();

        return {
            point: this.point,
            progress: this.progress,
            speed: this.speed
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.point);
        bytes.writeFloat(this.progress);
        bytes.writeFloat(this.speed);

        return bytes;
    }
}