import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetCryptKeysPacket extends Packet {

    public keys: number[] = [];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CRYPT_KEYS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        for (let i = 0; i < length; i++) {
            this.keys.push(bytes.readByte());
        }

        return {
            keys: this.keys
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.keys.length);
        this.keys.forEach(key => bytes.writeByte(key));
        return bytes;
    }
}