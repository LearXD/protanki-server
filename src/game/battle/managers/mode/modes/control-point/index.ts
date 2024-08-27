import { Player } from "@/game/player";
import { SetLoadControlPointPacket } from "@/network/packets/set-load-control-point";
import { Vector3d } from "@/utils/vector-3d";
import { BattleTeamModeManager } from "../team/team"; import { MathUtils } from "@/utils/math";
import { ControlPoint } from "@/game/battle/objects/control-point";

export class BattleControlPointsModeManager extends BattleTeamModeManager {

    public controlPoints: ControlPoint[] = []

    public init(): void {
        super.init();

        if (this.controlPoints.length > 0) {
            return;
        }

        this.battle.map.points.forEach((point, id) => {
            const controlPoint = new ControlPoint(id, point.name, this, Vector3d.fromInterface(point.position, false))
            this.controlPoints.push(controlPoint)
            this.battle.collisionManager.addObject(controlPoint)
        })
    }

    public getRandomSpawn(player: Player) {
        const spawns = this.battle.map.spawns
            .filter(spawn => spawn.type === 'dom' || spawn.team === player.tank.team)

        if (spawns.length > 0) {
            return MathUtils.arrayRandom(spawns)
        }

        return null
    }

    public sendLoadBattleMode(player: Player): void {
        const packet = new SetLoadControlPointPacket();
        packet.keypointTriggerRadius = 10
        packet.keypointVisorHeight = 500
        packet.minesRestrictionRadius = 5
        packet.controlPoints = this.controlPoints.map((point) => ({
            id: point.id,
            name: point.point,
            position: point.position,
            score: point.score,
            scoreChangeRate: 0,
            state: point.state,
            tankIds: point.getCapturingPlayers().map(player => player.getUsername())
        }));
        packet.resources = {
            bigLetters: 150231,
            blueCircle: 102373,
            bluePedestalTexture: 915688,
            blueRay: 560829,
            blueRayTip: 546583,
            neutralCircle: 982573,
            neutralPedestalTexture: 298097,
            pedestal: 992320,
            redCircle: 474249,
            redPedestalTexture: 199168,
            redRay: 217165,
            redRayTip: 370093
        }
        packet.sounds = {
            pointCaptureStartNegativeSound: 832304,
            pointCaptureStartPositiveSound: 345377,
            pointCaptureStopNegativeSound: 730634,
            pointCaptureStopPositiveSound: 930495,
            pointCapturedNegativeSound: 240260,
            pointCapturedPositiveSound: 567101,
            pointNeutralizedNegativeSound: 650249,
            pointNeutralizedPositiveSound: 752472,
            pointScoreDecreasingSound: 679479,
            pointScoreIncreasingSound: 752002
        }
        player.sendPacket(packet);
    }

}