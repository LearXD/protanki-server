import { v4 } from "uuid"
import { Battle } from "../.."
import { BattleMode } from "../../../../states/battle-mode"
import { BattleTeamDeathMatchModeManager } from "../../managers/mode/modes/team-death-match"
import { BattleCaptureTheFlagModeManager } from "../../managers/mode/modes/capture-the-flag"
import { Logger } from "@/utils/logger"
import { BattleDeathMatchModeManager } from "../../managers/mode/modes/death-match"
import { BattleControlPointsModeManager } from "../../managers/mode/modes/control-point"
import { IBattleList } from "@/network/packets/set-battle-list"
import { SuspiciousLevel } from "@/states/suspicious-level"
import { Team } from "@/states/team"

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

    public static toBattleListItem(battle: Battle): IBattleList {
        const item: IBattleList = {
            battleId: battle.battleId,
            battleMode: battle.data.battleMode,
            map: battle.map.getId(),
            maxPeople: battle.data.maxPeopleCount,
            name: battle.name,
            privateBattle: battle.isPrivateBattle(),
            proBattle: battle.isProBattle(),
            minRank: battle.getRankRange().min,
            maxRank: battle.getRankRange().max,
            preview: battle.map.getPreview(),
            parkourMode: battle.isParkourMode(),
            equipmentConstraintsMode: battle.getEquipmentConstraintsMode(),
            suspicionLevel: SuspiciousLevel.NONE
        }

        if (battle.getMode() === BattleMode.DM) {
            item.users = battle.playersManager.getPlayers().map(player => player.getName())
        }

        if (battle.getMode() !== BattleMode.DM) {
            item.usersBlue = battle.playersManager.getPlayers().filter(player => player.tank.team === Team.BLUE).map(player => player.getName())
            item.usersRed = battle.playersManager.getPlayers().filter(player => player.tank.team === Team.RED).map(player => player.getName())
        }

        return item
    }

}