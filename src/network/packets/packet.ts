import { ByteArray } from "../../utils/network/byte-array";

export class Packet {

    // int size
    static readonly LENGTH_SIZE = 4;
    static readonly PID_SIZE = 4;

    static readonly HEADER_SIZE = Packet.LENGTH_SIZE + Packet.PID_SIZE;

    constructor(
        public id: number,
        public bytes: ByteArray = new ByteArray()
    ) { }

    public toByteArray() {
        return new ByteArray()
            .writeInt(this.getLength() + Packet.HEADER_SIZE)
            .writeInt(this.id)
            .write(this.bytes.buffer)
    }

    public encode() {
        throw new Error('Method not implemented')
    }

    public decode() {
        throw new Error('Method not implemented')
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