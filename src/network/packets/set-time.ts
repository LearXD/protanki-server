import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTimePacket extends Packet {

    public clientSessionTime: number;

    public serverSessionTime: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TIME, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.clientSessionTime = bytes.readInt();
        this.serverSessionTime = bytes.readInt();

        return {
            serverSessionTime: this.serverSessionTime,
            clientSessionTime: this.clientSessionTime
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.serverSessionTime);
        bytes.writeInt(this.clientSessionTime);
        return bytes;
    }
}