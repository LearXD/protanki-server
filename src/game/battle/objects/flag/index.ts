import { Player } from "@/game/player";
import { BattleObject } from "../../managers/collisions/utils/object";
import { Vector3d } from "@/utils/vector-3d";
import { BattleCaptureTheFlagModeManager } from "../../managers/mode/modes/capture-the-flag";
import { FlagState } from "../../managers/mode/modes/capture-the-flag/types";
import { Team, TeamType } from "@/states/team";

export class Flag extends BattleObject {

    public state: FlagState = FlagState.AT_BASE
    public carrier: Player = null

    public constructor(
        public readonly manager: BattleCaptureTheFlagModeManager,
        public readonly team: TeamType,
        position: Vector3d,
    ) {
        super(`${team}_flag`, position, 250);
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
        this.carrier = player;
    }

    public isCarrier(player: Player): boolean {
        return this.state === FlagState.CARRIED && this.carrier === player;
    }

    public handleCollision(player: Player): boolean {

        if (player.getTank().getTeam() === this.team) {
            if (this.state === FlagState.DROPPED) {
                this.manager.handleReturnFlag(player, this);
            }

            if (this.state === FlagState.AT_BASE) {
                const team = this.team === Team.RED ? Team.BLUE : Team.RED;
                const flag = this.manager.getFlag(team);

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