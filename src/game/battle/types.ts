import { BattleModeType } from "../../utils/game/battle-mode"
import { EquipmentConstraintsModeType } from "../../utils/game/equipment-constraints-mode"
import { ThemeType } from "../../utils/game/theme"

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