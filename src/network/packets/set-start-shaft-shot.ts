import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetStartShaftShotPacket extends Packet {

    public shooter: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_START_SHAFT_SHOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();

        return {
            shooter: this.shooter
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.shooter);

        return bytes;
    }
}