import { Player } from "@/game/player";
import { BattleObject } from "../../managers/collisions/utils/object";
import { Vector3d } from "@/utils/vector-3d";
import { BattleCaptureTheFlagModeManager } from "../../managers/mode/modes/capture-the-flag";
import { FlagState } from "../../managers/mode/modes/capture-the-flag/types";
import { TeamType } from "@/states/team";

export class Flag extends BattleObject {

    public constructor(
        public readonly manager: BattleCaptureTheFlagModeManager,
        public readonly team: TeamType,
        position: Vector3d,
    ) {
        super(`${team}_FLAG`, position, 250);
    }

    public handleCollision(player: Player): boolean {
        const flagState = this.manager.getTeamFlagState(this.team);

        if (player.getTank().getTeam() === this.team) {
            if (flagState === FlagState.DROPPED) {
                this.manager.handleReturnFlag(player, this);
                return false;
            }

            if (flagState === FlagState.PLACED && player.getTank().hasFlag) {
                this.manager.handleCaptureFlag(player);
                return false;
            }

            return false;
        }

        if (flagState === FlagState.PLACED) {
            this.manager.handleTakeFlag(player, this);
            return true;
        }

        if (flagState === FlagState.DROPPED) {
            this.manager.handleTakeFlag(player, this);
            return true;
        }

        return false;
    }

}