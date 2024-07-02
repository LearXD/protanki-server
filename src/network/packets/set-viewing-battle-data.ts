import { BattleModes } from "../../utils/game/battle-mode";
import { EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IViewingData {
    battleMode: BattleModes,
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
    equipmentConstraintsMode: EquipmentConstraintsModes,
    reArmorEnabled: boolean,
    usersBlue: string[],
    usersRed: string[],
    scoreRed: number,
    scoreBlue: number,
    autoBalance: boolean,
    friendlyFire: boolean,
}

export class SetViewingBattleDataPacket extends Packet {

    public data: IViewingData;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_VIEWING_BATTLE_DATA, bytes)
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