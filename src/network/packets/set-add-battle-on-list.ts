import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBattle {
    battleId: string;
    battleMode: string;
    map: string;
    maxPeople: number;
    name: string;
    privateBattle: boolean;
    proBattle: boolean;
    minRank: number;
    maxRank: number;
    preview: number;
    parkourMode: boolean;
    equipmentConstraintsMode: string;
    suspicionLevel: string;
    usersBlue: string[];
    usersRed: string[];
}

export class SetAddBattleOnListPacket extends Packet {

    public data: IBattle;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_ADD_BATTLE_ON_LIST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.data = JSON.parse(json);
        } catch (e) {
            console.error(e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify(this.data));
        return bytes;
    }
}