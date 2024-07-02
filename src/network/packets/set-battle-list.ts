import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBattleList {
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

export class SetBattleListPacket extends Packet {

    public battles: IBattleList[];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_LIST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.battles = JSON.parse(json).battles;
        } catch (e) {
            console.error(e);
        }

        return {
            battles: this.battles
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify({ battles: this.battles }));
        return bytes;
    }
}