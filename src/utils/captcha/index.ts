import { ByteArray } from "../../network/utils/byte-array";

export class CaptchaUtils {
    public static decode(data: number[]) {
        const byteArray = new ByteArray();

        for (const byte of data) {
            byteArray.writeByte(byte);
        }

        return Buffer.from(byteArray.getBuffer())
    }

    public static encode(data: Buffer) {
        const byteArray = new ByteArray(data);

        const size = byteArray.getBuffer().length;
        const result = new Array(size);

        for (let i = 0; i < size; i++) {
            result[i] = byteArray.readByte();
        }

        return result;
    }
}