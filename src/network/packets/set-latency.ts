import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetLatencyPacket extends Packet {

    public serverSessionTime: number;
    public clientPing: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LATENCY, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.serverSessionTime = bytes.readInt();
        this.clientPing = bytes.readInt();

        return {
            serverSessionTime: this.serverSessionTime,
            clientPing: this.clientPing
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.serverSessionTime);
        bytes.writeInt(this.clientPing);
        return bytes;
    }
}