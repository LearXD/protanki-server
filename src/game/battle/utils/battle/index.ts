import { v4 } from "uuid"
import { Battle } from "../.."
import { BattleMode } from "../../../../states/battle-mode"
import { BattleDeathMatchModeManager } from "../../managers/mode/modes/death-match"
import { BattleTeamDeathMatchModeManager } from "../../managers/mode/modes/team-death-match"
import { BattleCaptureTheFlagModeManager } from "../../managers/mode/modes/capture-the-flag"
import { BattleControlPointsModeManager } from "../../managers/mode/modes/control-points"
import { Logger } from "@/utils/logger"

export class BattleUtils {

    public static generateBattleId() {
        return v4().substring(0, 8) + v4().substring(0, 8)
    }

    public static getBattleManager(battle: Battle) {
        switch (battle.getMode()) {
            case BattleMode.DM: return new BattleDeathMatchModeManager(battle)
            case BattleMode.TDM: return new BattleTeamDeathMatchModeManager(battle)
            case BattleMode.CTF: return new BattleCaptureTheFlagModeManager(battle)
            case BattleMode.CP: return new BattleControlPointsModeManager(battle)
            default: {
                Logger.warn(`Unknown battle mode ${battle.getMode()}`)
                return new BattleDeathMatchModeManager(battle)
            }
        }
    }

}