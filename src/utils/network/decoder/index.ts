import { ByteArray } from "../byte-array";

export enum XorType {
    SERVER = 'server',
    CLIENT = 'client'
}

export class XorDecoder {

    private static readonly LENGTH = 8;

    private keys: number[] = [];

    private decrypt_keys: number[] = new Array(XorDecoder.LENGTH);
    private encrypt_keys: number[] = new Array(XorDecoder.LENGTH);

    private cryptoNumber: number;

    private encryptPosition: number = 0;
    private decryptPosition: number = 0;

    public init(keys: number[], type: XorType = XorType.CLIENT) {

        var _loc2_ = 0;
        while (_loc2_ < keys.length) {
            this.cryptoNumber ^= keys[_loc2_];
            _loc2_++;
        }
        var _loc3_ = 0;
        while (_loc3_ < XorDecoder.LENGTH) {

            if (type === XorType.CLIENT) {
                this.decrypt_keys[_loc3_] = this.cryptoNumber ^ _loc3_ << 3;
                this.encrypt_keys[_loc3_] = this.cryptoNumber ^ _loc3_ << 3 ^ 87;
            }

            if (type === XorType.SERVER) {
                this.decrypt_keys[_loc3_] = this.cryptoNumber ^ _loc3_ << 3 ^ 87;
                this.encrypt_keys[_loc3_] = this.cryptoNumber ^ _loc3_ << 3;
            }

            _loc3_++;
        }

    }

    public static decodeKeys(data: ByteArray): number[] {
        var _loc2_ = data.readInt();
        var _loc3_ = new Array(_loc2_);
        var _loc4_ = 0;

        while (_loc4_ < _loc2_) {
            _loc3_[_loc4_] = data.readByte();
            _loc4_++;
        }

        return _loc3_;
    }

    public encrypt(data: ByteArray) {
        var _loc3_ = 0;
        var _loc2_ = 0;

        const encryptedData = new ByteArray(data.buffer);

        while (_loc2_ < encryptedData.length()) {
            _loc3_ = data.readByte();
            encryptedData.buffer[_loc2_] = _loc3_ ^ this.encrypt_keys[this.encryptPosition];
            this.encrypt_keys[this.encryptPosition] = _loc3_;
            this.encryptPosition ^= _loc3_ & 7;
            _loc2_++;
        }

        return encryptedData;
    }

    public decrypt(data: ByteArray) {
        var _loc3_ = 0;
        var _loc2_ = 0;

        const decryptedData = new ByteArray(data.buffer);

        while (_loc2_ < decryptedData.length()) {
            _loc3_ = data.readByte();
            this.decrypt_keys[this.decryptPosition] = _loc3_ ^ this.decrypt_keys[this.decryptPosition];
            decryptedData.buffer[_loc2_] = this.decrypt_keys[this.decryptPosition];
            this.decryptPosition ^= this.decrypt_keys[this.decryptPosition] & 7;
            _loc2_++;
        }

        return decryptedData;
    }

    public setKeys(keys: number[]) {
        this.keys = keys;
    }

    public getKeys() {
        return this.keys;
    }
}