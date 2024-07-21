import { BattleModeType } from "../../utils/game/battle-mode";
import { EquipmentConstraintsMode } from "../../utils/game/equipment-constraints-mode";
import { SuspiciousLevel } from "../../utils/game/suspicious-level";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBattleList {
    battleId: string
    battleMode: BattleModeType
    map: string
    maxPeople: number
    name: string
    privateBattle: boolean
    proBattle: boolean
    minRank: number
    maxRank: number
    preview: number
    parkourMode: boolean
    equipmentConstraintsMode: EquipmentConstraintsMode
    suspicionLevel: SuspiciousLevel
    usersBlue?: string[]
    usersRed?: string[]
    users?: string[]
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