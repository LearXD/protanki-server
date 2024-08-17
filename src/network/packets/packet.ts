import { ByteArray } from "../utils/byte-array";

export class Packet {

    static readonly LENGTH_SIZE = 4;
    static readonly PID_SIZE = 4;

    static readonly HEADER_SIZE = Packet.LENGTH_SIZE + Packet.PID_SIZE;

    static readonly BYTE_ARRAY = new ByteArray();

    constructor(
        public readonly id: number,
        public bytes: ByteArray = new ByteArray()
    ) { }

    public toByteArray() {
        return new ByteArray()
            .writeInt(this.getLength() + Packet.HEADER_SIZE)
            .writeInt(this.id)
            .write(this.bytes.buffer)
    }

    public encode() {
        return Packet.BYTE_ARRAY
    }

    public decode() {
        return {}
    }

    public setBytes(bytes: ByteArray) {
        this.bytes = bytes
    }

    public getBytes() {
        return this.bytes
    }

    public cloneBytes = () => {
        return new ByteArray(this.bytes.buffer)
    }

    public getLength() {
        return this.bytes.length
    }

    public getPacketId() {
        return this.id;
    }
}