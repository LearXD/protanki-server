import { Battle } from "../.."
import { BattleUtils } from "../../../../utils/battle"
import { BattleBoxesManager } from "../../managers/boxes"
import { BattleChatManager } from "../../managers/chat"
import { BattleDamageManager } from "../../managers/damage"
import { BattleEffectsManager } from "../../managers/effects"
import { BattleMinesManager } from "../../managers/mines"
import { BattleModeManager } from "../../managers/mode"
import { BattlePlayersManager } from "../../managers/players"
import { BattleResourcesManager } from "../../managers/resources"
import { BattleStatisticsManager } from "../../managers/statistics"
import { BattleTeamsManager } from "../../managers/teams"
import { BattleViewersManager } from "../../managers/viewers"

export abstract class BattleManager {

    protected playersManager: BattlePlayersManager
    protected viewersManager: BattleViewersManager
    protected teamsManager: BattleTeamsManager
    protected chatManager: BattleChatManager

    protected modeManager: BattleModeManager
    protected statisticsManager: BattleStatisticsManager

    protected resourcesManager: BattleResourcesManager

    protected minesManager: BattleMinesManager
    protected effectsManager: BattleEffectsManager
    protected boxesManager: BattleBoxesManager

    protected damageManager: BattleDamageManager

    protected registerManagers(battle: Battle) {
        this.playersManager = new BattlePlayersManager(battle)
        this.viewersManager = new BattleViewersManager(battle)
        this.teamsManager = new BattleTeamsManager(battle)
        this.chatManager = new BattleChatManager(battle)

        this.modeManager = BattleUtils.getBattleManager(battle)
        this.statisticsManager = new BattleStatisticsManager(battle)

        this.resourcesManager = new BattleResourcesManager(battle)
        this.minesManager = new BattleMinesManager()
        this.effectsManager = new BattleEffectsManager()
        this.boxesManager = new BattleBoxesManager()

        this.damageManager = new BattleDamageManager(battle)
    }

    public getPlayersManager(): BattlePlayersManager {
        return this.playersManager
    }

    public getViewersManager(): BattleViewersManager {
        return this.viewersManager
    }
    public getTeamsManager(): BattleTeamsManager {
        return this.teamsManager
    }

    public getChatManager(): BattleChatManager {
        return this.chatManager
    }

    public getModeManager(): BattleModeManager {
        return this.modeManager
    }

    public getResourcesManager(): BattleResourcesManager {
        return this.resourcesManager
    }

    public getMinesManager(): BattleMinesManager {
        return this.minesManager
    }

    public getEffectsManager(): BattleEffectsManager {
        return this.effectsManager
    }

    public getStatisticsManager(): BattleStatisticsManager {
        return this.statisticsManager
    }

    public getBoxesManager(): BattleBoxesManager {
        return this.boxesManager
    }

    public getDamageManager(): BattleDamageManager {
        return this.damageManager
    }
}