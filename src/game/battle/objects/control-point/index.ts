import { Player } from "@/game/player";
import { BattleObject } from "../../managers/collisions/utils/object";
import { Vector3d } from "@/utils/vector-3d";
import { ControlPointState, ControlPointStateType } from "@/states/control-point-state";
import { BattleControlPointsModeManager } from "../../managers/mode/modes/control-point";
import { SetTeamStartedCapturingControlPointPacket } from "@/network/packets/set-team-started-capturing-control-point";
import { Team, TeamType } from "@/states/team";
import { SetTankCapturingControlPointPacket } from "@/network/packets/set-tank-capturing-control-point";
import { SetCapturingPointPacket } from "@/network/packets/set-capturing-point";
import { SetTeamStoppedCapturingControlPointPacketPacket } from "@/network/packets/set-team-stopped-capturing-control-point-packet";
import { SetTankStopCapturingControlPointPacket } from "@/network/packets/set-tank-stop-capturing-control-point";
import { SetControlPointStatePacket } from "@/network/packets/set-control-point-state";
import { Battle } from "../..";
import { Logger } from "@/utils/logger";

export class ControlPoint extends BattleObject {

    public static readonly MAX_SCORE = 100
    public static readonly CAPTURE_SPEED = 20

    public changeStateTask: number;

    public state: ControlPointStateType = ControlPointState.NEUTRAL
    public score: number = 0

    public constructor(
        public readonly id: number,
        public readonly point: string,
        public readonly manager: BattleControlPointsModeManager,
        public readonly position: Vector3d,
    ) {
        super(`point_${point}`, position, 1500);
    }

    public getCapturingPlayers(): Player[] {
        return Array.from(this.colliding);
    }

    public setScore(number: number) {
        Logger.debug(`Control point ${this.point} score: ${this.score} -> ${number}`)
        this.score = number;
    }

    public getCapturingSpeed(): number {
        const players = this.getCapturingPlayers()

        if (players.length) {
            return players.map(
                player => player.tank.team === Team.BLUE ?
                    ControlPoint.CAPTURE_SPEED :
                    -ControlPoint.CAPTURE_SPEED
            )
                .reduce((a, b) => a + b, 0)
        }

        if (this.score !== 0) {

            switch (this.state) {
                case ControlPointState.BLUE: {
                    if (this.score < ControlPoint.MAX_SCORE) {
                        return ControlPoint.CAPTURE_SPEED;
                    }
                    break;
                }

                case ControlPointState.RED: {
                    if (this.score > -ControlPoint.MAX_SCORE) {
                        return -ControlPoint.CAPTURE_SPEED;
                    }
                    break;
                }

                case ControlPointState.NEUTRAL: {
                    return ControlPoint.CAPTURE_SPEED * Math.sign(this.score) * -1;
                }
            }
        }

        return 0;
    }

    public setState(state: ControlPointStateType): void {
        const packet = new SetControlPointStatePacket();
        packet.pointId = this.id
        this.state = packet.state = state
        this.manager.battle.broadcastPacket(packet)
    }

    public broadcastTeamStarterCapturing(team: TeamType): void {
        const packet = new SetTeamStartedCapturingControlPointPacket();
        packet.team = team
        this.manager.battle.broadcastPacket(packet)
    }

    public broadcastTeamStoppedCapturing(team: TeamType): void {
        const packet = new SetTeamStoppedCapturingControlPointPacketPacket();
        packet.team = team
        this.manager.battle.broadcastPacket(packet)
    }

    public broadcastTankStartedCapturing(player: Player): void {
        const packet = new SetTankCapturingControlPointPacket();
        packet.pointId = this.id
        packet.tankId = player.getUsername()
        this.manager.battle.broadcastPacket(packet)
    }

    public broadcastTankStoppedCapturing(player: Player): void {
        const packet = new SetTankStopCapturingControlPointPacket();
        packet.pointId = this.id
        packet.tankId = player.getUsername()
        this.manager.battle.broadcastPacket(packet)
    }

    public broadcastCapturingProgress(): void {
        const packet = new SetCapturingPointPacket();

        packet.point = this.id
        packet.progress = this.score
        packet.speed = this.getCapturingSpeed()

        this.manager.battle.broadcastPacket(packet)
    }

    public onStartColliding(player: Player): void {
        if (this.state === ControlPointState.NEUTRAL || this.state !== player.tank.team) {
            this.broadcastTeamStarterCapturing(player.tank.team)
        }
        this.broadcastTankStartedCapturing(player)
        this.broadcastCapturingProgress()
    }

    public onStopColliding(player: Player): void {
        if (this.state === ControlPointState.NEUTRAL || this.state !== player.tank.team) {
            this.broadcastTeamStoppedCapturing(player.tank.team)
        }
        this.broadcastTankStoppedCapturing(player)
        this.broadcastCapturingProgress()
    }

    public update(tick: number) {
        if (tick % Battle.TICK_RATE === 0) {
            let score = this.score + this.getCapturingSpeed()

            switch (this.state) {
                case ControlPointState.BLUE: {

                    if (score <= 0) {
                        this.setState(ControlPointState.NEUTRAL)
                    }

                    if (score >= ControlPoint.MAX_SCORE) {
                        return;
                    }

                    break
                }

                case ControlPointState.RED: {

                    if (score >= 0) {
                        this.setState(ControlPointState.NEUTRAL)
                    }

                    if (score <= -ControlPoint.MAX_SCORE) {
                        return;
                    }

                    break
                }

                case ControlPointState.NEUTRAL: {

                    if (score >= ControlPoint.MAX_SCORE) {
                        score = ControlPoint.MAX_SCORE
                        this.setState(ControlPointState.BLUE)
                    }

                    if (score <= -ControlPoint.MAX_SCORE) {
                        score = -ControlPoint.MAX_SCORE
                        this.setState(ControlPointState.RED)
                    }

                    break;
                }
            }

            // Logger.debug(`Control point ${this.point} score: ${this.score} -> ${score}`)
            this.score = score
        }
    }
}