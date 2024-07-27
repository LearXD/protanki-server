import { BattleModeType } from "../../states/battle-mode"
import { EquipmentConstraintsModeType } from "../../states/equipment-constraints-mode"
import { ThemeType } from "../../states/theme"

export interface IBattleData {
    autoBalance: boolean,
    battleMode: BattleModeType,
    equipmentConstraintsMode: EquipmentConstraintsModeType,
    friendlyFire: boolean,
    scoreLimit: number,
    timeLimitInSec: number,
    maxPeopleCount: number,
    parkourMode: boolean,
    privateBattle: boolean,
    proBattle: boolean,
    rankRange: {
        max: number,
        min: number
    },
    reArmorEnabled: boolean,
    theme?: ThemeType,
    withoutBonuses: boolean,
    withoutCrystals: boolean,
    withoutSupplies: boolean
}