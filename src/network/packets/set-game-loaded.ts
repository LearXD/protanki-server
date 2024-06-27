import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetGameLoadedPacket extends Packet {

    constructor(bytes: ByteArray) {
        super(Protocol.SET_GAME_LOADED, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        return {

        }
    }

    public encode() {
        const bytes = new ByteArray();

        return bytes;
    }
}