import { Player } from "@/game/player";
import { BattleObject } from "../../managers/collisions/utils/object";
import { Vector3d } from "@/utils/vector-3d";
import { BattleCaptureTheFlagModeManager } from "../../managers/mode/modes/capture-the-flag";
import { FlagState } from "../../managers/mode/modes/capture-the-flag/types";
import { Team, TeamType } from "@/states/team";
import { BattleTask } from "../../utils/task";
import { Logger } from "@/utils/logger";

export class Flag extends BattleObject {

    public state: FlagState = FlagState.AT_BASE

    public droppedAt: number = 0
    public carriedBy: Player = null

    public carrier: Player = null

    public returnTask: BattleTask = null

    public constructor(
        public readonly manager: BattleCaptureTheFlagModeManager,
        public readonly team: TeamType,
        position: Vector3d,
    ) {
        super(`${team}_flag`, position, 250);
    }

    public destroy(): void {
        if (this.returnTask) {
            this.manager.battle.taskManager.cancelTask(this.returnTask.id)
        }
    }

    public getState(): FlagState {
        return this.state;
    }

    public setState(state: FlagState): void {
        this.state = state;
    }

    public getCarrier(): Player {
        return this.carrier;
    }

    public setCarrier(player: Player): void {
        if (player === null) {
            this.carriedBy = this.carrier;
            this.droppedAt = Date.now();
            return;
        }
        this.carrier = player;
    }

    public isCarrier(player: Player): boolean {
        return this.state === FlagState.CARRIED && this.carrier === player;
    }

    public handleCollision(player: Player): boolean {

        if (this.carriedBy && this.carriedBy === player && (Date.now() - this.droppedAt < 3000)) {
            return false;
        }

        if (player.tank.team === this.team) {
            if (this.state === FlagState.DROPPED) {
                this.manager.handleReturnFlag(this, player);
            }

            if (this.state === FlagState.AT_BASE) {
                const team = this.team === Team.RED ? Team.BLUE : Team.RED;
                const flag = this.manager.flags.get(team);

                if (flag.isCarrier(player)) {
                    this.manager.handleCaptureFlag(flag);
                }
            }

            return false;
        }

        if (this.state === FlagState.AT_BASE) {
            this.manager.handleTakeFlag(player, this);
            return true;
        }

        if (this.state === FlagState.DROPPED) {
            this.manager.handleTakeFlag(player, this);
            return true;
        }

        return false;
    }

}