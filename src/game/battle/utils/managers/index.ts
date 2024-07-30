import { Battle } from "../.."
import { BattleUtils } from "../battle"
import { BattleBoxesManager } from "../../managers/boxes"
import { BattleChatManager } from "../../managers/chat"
import { BattleCombatManager } from "../../managers/combat"
import { BattleEffectsManager } from "../../managers/effects"
import { BattleMinesManager } from "../../managers/mines"
import { BattleModeManager } from "../../managers/mode"
import { BattlePlayersManager } from "../../managers/players"
import { BattleResourcesManager } from "../../managers/resources"
import { BattleTaskManager } from "../../managers/task"
import { BattleViewersManager } from "../../managers/viewers"
import { BattleCollisionsManager } from "../../managers/collisions"

export abstract class BattleManager {

    protected modeManager: BattleModeManager
    protected collisionManager: BattleCollisionsManager

    protected damageManager: BattleCombatManager

    protected playersManager: BattlePlayersManager
    protected viewersManager: BattleViewersManager

    protected chatManager: BattleChatManager

    protected resourcesManager: BattleResourcesManager

    protected minesManager: BattleMinesManager
    protected effectsManager: BattleEffectsManager
    protected boxesManager: BattleBoxesManager

    protected taskManager: BattleTaskManager

    protected registerManagers(battle: Battle) {
        this.modeManager = BattleUtils.getBattleManager(battle)

        this.collisionManager = new BattleCollisionsManager(battle)

        this.damageManager = new BattleCombatManager(battle)

        this.playersManager = new BattlePlayersManager(battle)
        this.viewersManager = new BattleViewersManager(battle)

        this.chatManager = new BattleChatManager(battle)

        this.resourcesManager = new BattleResourcesManager(battle)
        this.minesManager = new BattleMinesManager()
        this.effectsManager = new BattleEffectsManager()
        this.boxesManager = new BattleBoxesManager()

        this.taskManager = new BattleTaskManager()
    }

    public getCollisionManager(): BattleCollisionsManager {
        return this.collisionManager
    }

    public getPlayersManager(): BattlePlayersManager {
        return this.playersManager
    }

    public getViewersManager(): BattleViewersManager {
        return this.viewersManager
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

    public getBoxesManager(): BattleBoxesManager {
        return this.boxesManager
    }

    public getDamageManager(): BattleCombatManager {
        return this.damageManager
    }

    public getTaskManager(): BattleTaskManager {
        return this.taskManager
    }
}