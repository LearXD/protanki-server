import { v4 } from "uuid"
import { Battle } from "../.."
import { BattleMode } from "../../../../states/battle-mode"
import { BattleDeathMatchModeManager } from "../../managers/mode/modes/death-match"
import { BattleTeamDeathMatchModeManager } from "../../managers/mode/modes/team-death-match"

export class BattleUtils {

    public static getBattleManager(battle: Battle) {
        switch (battle.getMode()) {
            case BattleMode.DM: return new BattleDeathMatchModeManager(battle)
            case BattleMode.TDM: return new BattleTeamDeathMatchModeManager(battle)
            default: {
                throw new Error(`Unknown battle mode: ${battle.getMode()}`)
            }
        }
    }

    public static generateBattleId() {
        return v4().substring(0, 8) + v4().substring(0, 8)
    }
}