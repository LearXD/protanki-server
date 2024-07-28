import { BattleModeType } from "../../states/battle-mode";
import { EquipmentConstraintsModeType } from "../../states/equipment-constraints-mode";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBattleUser {
    kills: number,
    score: number,
    suspicious: boolean,
    user: string,
}

export interface IViewingData {
    battleMode: BattleModeType,
    itemId: string,
    scoreLimit: number,
    timeLimitInSec: number,
    preview: number,
    maxPeopleCount: number,
    name: string,
    proBattle: boolean,
    minRank: number,
    maxRank: number,
    roundStarted: boolean,
    spectator: boolean,
    withoutBonuses: boolean,
    withoutCrystals: boolean,
    withoutSupplies: boolean,
    proBattleEnterPrice: number,
    timeLeftInSec: number,
    userPaidNoSuppliesBattle: boolean,
    proBattleTimeLeftInSec: number,
    parkourMode: boolean,
    equipmentConstraintsMode: EquipmentConstraintsModeType,
    reArmorEnabled: boolean,
    // SOLO PROPS
    users?: IBattleUser[],
    // TEAM PROPS
    autoBalance?: boolean,
    friendlyFire?: boolean,
    usersBlue?: IBattleUser[],
    usersRed?: IBattleUser[],
    scoreRed?: number,
    scoreBlue?: number,
}

export class SetViewingBattleDataPacket extends Packet {

    public data: IViewingData;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_VIEWING_BATTLE_DATA, bytes)
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