import { Vector3d } from "../../game/vector-3d";

export class ByteArray {

    static MAX_BUFFER_SIZE = 2900;

    constructor(
        public buffer?: Buffer
    ) {
        this.buffer = buffer ? Buffer.from(buffer) : Buffer.alloc(0);
    }

    public getBuffer() {
        return this.buffer;
    }

    writeByte(value: number) {
        let buffer = Buffer.alloc(1);
        buffer.writeInt8(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    writeUByte(value: number) {
        let buffer = Buffer.alloc(1);
        buffer.writeUInt8(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    writeShort(value: number) {
        let buffer = Buffer.alloc(2);
        buffer.writeInt16BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    writeUShort(value: number) {
        let buffer = Buffer.alloc(2);
        buffer.writeUInt16BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    writeInt(value: number) {
        let buffer = Buffer.alloc(4);
        buffer.writeInt32BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    writeUInt(value: number) {
        let buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    readFloat() {
        let value = this.buffer.subarray(0, 4).readFloatBE();
        this.buffer = this.buffer.subarray(4);

        if (typeof value === 'string') {
            return parseFloat(value)
        }

        return value
    }

    writeFloat(value: number) {
        let buffer = Buffer.alloc(4);
        buffer.writeFloatBE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    writeBoolean(value: boolean) {
        return this.writeByte(value ? 1 : 0);
    }

    write(value: string | Buffer) {
        this.buffer = Buffer.concat([this.buffer, Buffer.from(value)]);
        return this;
    }

    readByte() {
        let value = this.buffer.subarray(0, 1).readInt8();
        this.buffer = this.buffer.subarray(1);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    readBytes(length: number) {
        let value = this.buffer.subarray(0, length);
        this.buffer = this.buffer.subarray(length);

        return value
    }

    readUByte() {
        let value = this.buffer.subarray(0, 1).readUInt8();
        this.buffer = this.buffer.subarray(1);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    readShort() {
        let value = this.buffer.subarray(0, 2).readInt16BE();
        this.buffer = this.buffer.subarray(2);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    readUShort() {
        let value = this.buffer.subarray(0, 2).readUInt16BE();
        this.buffer = this.buffer.subarray(2);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    readUnsignedInt() {
        let value = this.buffer.subarray(0, 4).readUInt32BE();
        this.buffer = this.buffer.subarray(4);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    writeUnsignedInt(value: number) {
        let buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        return this;
    }

    readInt() {
        let value = this.buffer.subarray(0, 4).readInt32BE();
        this.buffer = this.buffer.subarray(4);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    readUInt() {
        let value = this.buffer.subarray(0, 4).readUInt32BE();
        this.buffer = this.buffer.subarray(4);

        if (typeof value === 'string') {
            return parseInt(value)
        }

        return value
    }

    readStringArray(): string[] | null {
        if (this.readBoolean()) {
            return null;
        }

        const size = this.readInt();
        let strings = new Array(size);

        for (let i = 0; i < size; i++) {
            strings[i] = this.readString();
        }

        return strings;
    }

    writeStringArray(strings: string[] | null) {
        if (strings === null || strings.length === 0) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeInt(strings.length);
        strings.forEach(string => this.writeString(string));

        return this;
    }

    readString() {
        if (this.readBoolean()) {
            return null;
        }

        const length = this.readInt();

        if (length === 0) {
            return null;
        }

        return this.readBytes(length).toString()
    }

    public writeString(value: string) {
        if (value === null) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeInt(Buffer.byteLength(value));

        this.write(value);

        return this;
    }

    readVector3d() {
        if (this.readBoolean()) {
            return null;
        }

        const x = this.readFloat();
        const z = this.readFloat();
        const y = this.readFloat();

        return new Vector3d(x, z, y);
    }

    writeVector3d(value?: { x: number, z: number, y: number }) {
        if (value === null) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeFloat(value.x);
        this.writeFloat(value.z);
        this.writeFloat(value.y);

        return this;
    }

    readVector3dArray() {
        if (this.readBoolean()) {
            return null;
        }

        const size = this.readInt();
        let vectors = new Array(size);

        for (let i = 0; i < size; i++) {
            vectors[i] = this.readVector3d();
        }

        return vectors;
    }

    writeVector3dArray(vectors: { x: number, z: number, y: number }[]) {
        if (vectors === null || vectors.length === 0) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeInt(vectors.length);

        vectors.forEach(vector => {
            this.writeVector3d(vector);
        });

        return this;
    }



    readBoolean() {
        return this.readByte() !== 0;
    }

    readArray<T>(elementsFunction: Function): T[] {

        if (this.readBoolean()) {
            return null;
        }

        const size = this.readInt();
        const elements = new Array(size);

        for (let i = 0; i < size; i++) {
            elements[i] = elementsFunction();
        }

        return elements;
    }

    writeArray<T>(elements: T[], elementsFunction: Function) {
        if (elements === null || elements.length === 0) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeInt(elements.length);

        elements.forEach(element => {
            elementsFunction(element);
        });

        return this;
    }

    length() {
        return this.buffer.length;
    }
}
