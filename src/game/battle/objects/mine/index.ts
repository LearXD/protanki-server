import { Player } from "@/game/player";
import { BattleObject } from "../../managers/collisions/utils/object";
import { Vector3d } from "@/utils/vector-3d";
import { BattleMode } from "@/states/battle-mode";
import { Logger } from "@/utils/logger";

export class Mine extends BattleObject {

    public active: boolean = true;

    public constructor(
        public readonly owner: Player,
        public readonly id: number,
        public readonly position: Vector3d
    ) {
        super(`mine_${id}`, position, 200);
    }

    public handleCollision(player: Player): boolean {
        // Logger.debug(`Mine.handleCollision: ${this.name} collided with ${player.tank.player.getUsername()}`);
        if (player !== this.owner) {
            const battle = player.battle
            if (battle) {
                if (player.tank.isEnemy(this.owner.tank)) {
                    // Logger.debug(`Mine.handleCollision: ${this.name} exploded by ${player.tank.player.getUsername()}`);
                    battle.minesManager.handleMineExplosion(this, player)
                    return true
                }
            }
        }
        return false
    }
}