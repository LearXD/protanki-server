import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSomePacketOnJoinBattle3Packet extends Packet {


    constructor(bytes: ByteArray) {
        super(Protocol.SET_SOME_PACKET_ON_JOIN_BATTLE_3, bytes)
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