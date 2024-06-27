import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetPlaceMinePacket extends Packet {

    public mineId: string;
    public x: number;
    public y: number;
    public z: number;
    public userId: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_PLACE_MINE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.mineId = bytes.readString();
        this.x = bytes.readFloat();
        this.y = bytes.readFloat();
        this.z = bytes.readFloat();
        this.userId = bytes.readString();

        return {
            mineId: this.mineId,
            x: this.x,
            y: this.y,
            z: this.z,
            userId: this.userId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.mineId);
        bytes.writeFloat(this.x);
        bytes.writeFloat(this.y);
        bytes.writeFloat(this.z);
        bytes.writeString(this.userId);

        return bytes;
    }
}