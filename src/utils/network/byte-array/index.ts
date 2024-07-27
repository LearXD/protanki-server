import { IVector3d, Vector3d } from "../../vector-3d";

export class ByteArray {

    static readonly MAX_BUFFER_SIZE = 2900;

    constructor(public buffer?: Buffer) {
        this.buffer = buffer ? Buffer.from(buffer) : Buffer.alloc(0);
    }

    public getBuffer() {
        return this.buffer;
    }

    public get length() {
        return this.buffer.length;
    }

    public writeByte(value: number) {
        const buffer = Buffer.alloc(1);
        buffer.writeInt8(value);
        this.write(buffer)
        return this;
    }

    public writeShort(value: number) {
        const buffer = Buffer.alloc(2);
        buffer.writeInt16BE(value);
        this.write(buffer);
        return this;
    }

    public writeInt(value: number) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32BE(value);
        this.write(buffer);
        return this;
    }

    public readFloat() {
        return this.read(4).readFloatBE();
    }

    public writeFloat(value: number) {
        const buffer = Buffer.alloc(4);
        buffer.writeFloatBE(value);
        this.write(buffer);
        return this;
    }

    public readBoolean() {
        return this.readByte() !== 0;
    }

    public writeBoolean(value: boolean) {
        return this.writeByte(value ? 1 : 0);
    }

    public readByte() {
        return this.read(1).readInt8();
    }

    public readShort() {
        return this.read(2).readInt16BE();
    }

    public readInt() {
        return this.read(4).readInt32BE()
    }

    public readString() {
        if (this.readBoolean()) {
            return null;
        }

        const length = this.readInt();

        if (length === 0) {
            return null;
        }

        return this.read(length).toString()
    }

    public writeString(value: string) {
        if (value === null) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeInt(Buffer.byteLength(value));

        this.write(Buffer.from(value));

        return this;
    }

    public readStringArray(): string[] | null {
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

    public writeStringArray(strings: string[] | null) {
        if (strings === null) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeInt(strings.length);
        strings.forEach(string => this.writeString(string));

        return this;
    }

    public readVector3d() {
        if (this.readBoolean()) {
            return null;
        }

        const x = this.readFloat();
        const z = this.readFloat();
        const y = this.readFloat();

        return new Vector3d(x, z, y);
    }

    public writeVector3d(value?: IVector3d) {
        if (value === null) {
            return this.writeBoolean(true);
        }

        this.writeBoolean(false);
        this.writeFloat(value.x);
        this.writeFloat(value.z);
        this.writeFloat(value.y);

        return this;
    }

    public readVector3dArray(): Vector3d[] | null {
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

    public writeVector3dArray(vectors: { x: number, z: number, y: number }[]) {
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


    public readArray<T>(elementsFunction: Function): T[] {

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

    public writeArray<T>(elements: T[], elementsFunction: Function) {
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

    public read(length: number) {
        const value = this.buffer.subarray(0, length);
        this.buffer = this.buffer.subarray(length);
        return value
    }

    public write(buffer: Buffer) {
        this.buffer = Buffer.concat([this.buffer, Buffer.from(buffer)]);
        return this;
    }
}
