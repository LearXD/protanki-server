import { Tank } from "../..";
import { IGarageItem, ITurretProperties, ITurretSfx } from "../../../../managers/garage/types";
import { SendFlameTargetsShotPacket } from "../../../../network/packets/send-flame-targets-shot";
import { SendFreezeTargetsShotPacket } from "../../../../network/packets/send-freeze-targets-shot";
import { SendHammerOverturnedShotPacket } from "../../../../network/packets/send-hammer-overturned-shot";
import { SendHammerShotPacket } from "../../../../network/packets/send-hammer-shot";
import { SendIsisShotPositionPacket } from "../../../../network/packets/send-isis-shot-position";
import { SendIsisTargetShotPacket } from "../../../../network/packets/send-isis-target-shot";
import { SendMoveShaftVerticalAxisPacket } from "../../../../network/packets/send-move-shaft-vertical-axis";
import { SendOpenShaftAimPacket } from "../../../../network/packets/send-open-shaft-aim";
import { SendRailgunShotPacket } from "../../../../network/packets/send-railgun-shot";
import { SendRicochetOverturnedShotPacket } from "../../../../network/packets/send-ricochet-overturned-shot";
import { SendRicochetShotPacket } from "../../../../network/packets/send-ricochet-shot";
import { SendRicochetTargetShotPacket } from "../../../../network/packets/send-ricochet-target-shot";
import { SendShaftAimShotPacket } from "../../../../network/packets/send-shaft-aim-shot";
import { SendShaftLocalSpotPacket } from "../../../../network/packets/send-shaft-local-spot";
import { SendShaftShotPacket } from "../../../../network/packets/send-shaft-shot";
import { SendShaftStopAimPacket } from "../../../../network/packets/send-shaft-stop-aim";
import { SendSmokyHitPointShotPacket } from "../../../../network/packets/send-smoky-hit-point-shot";
import { SendSmokyTargetShotPacket } from "../../../../network/packets/send-smoky-target-shot";
import { SendSmokyVoidShotPacket } from "../../../../network/packets/send-smoky-void-shot";
import { SendStartFlameShotPacket } from "../../../../network/packets/send-start-flame-shot";
import { SendStartFreezeShootPacket } from "../../../../network/packets/send-start-freeze-shoot";
import { SendStartIsisShotPacket } from "../../../../network/packets/send-start-isis-shot";
import { SendStartRailgunShotPacket } from "../../../../network/packets/send-start-railgun-shot";
import { SendStartShaftAimPacket } from "../../../../network/packets/send-start-shaft-aim";
import { SendStartVulcanShotPacket } from "../../../../network/packets/send-start-vulcan-shot";
import { SendStopFlameShotPacket } from "../../../../network/packets/send-stop-flame-shot";
import { SendStopFreezeShotPacket } from "../../../../network/packets/send-stop-freeze-shot";
import { SendStopIsisShotPacket } from "../../../../network/packets/send-stop-isis-shot";
import { SendStopVulcanShotPacket } from "../../../../network/packets/send-stop-vulcan-shot";
import { SendStormHitPointShotPacket } from "../../../../network/packets/send-storm-hit-point-shot";
import { SendStormTargetShotPacket } from "../../../../network/packets/send-storm-target-shot";
import { SendStormVoidShotPacket } from "../../../../network/packets/send-storm-void-shot";
import { SendTwinsHitPointShotPacket } from "../../../../network/packets/send-twins-hit-point-shot";
import { SendTwinsShotPacket } from "../../../../network/packets/send-twins-shot";
import { SendVulcanShotPacket } from "../../../../network/packets/send-vulcan-shot";
import { ITarget, SetHammerShotPacket } from "../../../../network/packets/set-hammer-shot";
import { SetIsisShotPositionPacket } from "../../../../network/packets/set-isis-shot-position";
import { SetMoveShaftVerticalAxisPacket } from "../../../../network/packets/set-move-shaft-vertical-axis";
import { SetRailgunShotPacket } from "../../../../network/packets/set-railgun-shot";
import { SetRicochetShotPacket } from "../../../../network/packets/set-ricochet-shot";
import { SetShaftLocalSpotPacket } from "../../../../network/packets/set-shaft-local-spot";
import { SetShaftShotPacket } from "../../../../network/packets/set-shaft-shot";
import { SetSmokyCriticalEffectPacket } from "../../../../network/packets/set-smoky-critical-effect";
import { SetSmokyHitPointPacket } from "../../../../network/packets/set-smoky-hit-point";
import { SetSmokyTargetShotPacket } from "../../../../network/packets/set-smoky-target-shot";
import { SetSmokyVoidShotPacket } from "../../../../network/packets/set-smoky-void-shot";
import { SetStartFlameShotPacket } from "../../../../network/packets/set-start-flame-shot";
import { SetStartFreezeShotPacket } from "../../../../network/packets/set-start-freeze-shot";
import { SetStartIsisShotPacket } from "../../../../network/packets/set-start-isis-shot";
import { SetStartRailgunShotPacket } from "../../../../network/packets/set-start-railgun-shot";
import { SetStartShaftShotPacket } from "../../../../network/packets/set-start-shaft-shot";
import { SetStartVulcanShotPacket } from "../../../../network/packets/set-start-vulcan-shot";
import { SetStopFlameShotPacket } from "../../../../network/packets/set-stop-flame-shot";
import { SetStopFreezeShotPacket } from "../../../../network/packets/set-stop-freeze-shot";
import { SetStopIsisShotPacket } from "../../../../network/packets/set-stop-isis-shot";
import { SetStopShaftShotPacket } from "../../../../network/packets/set-stop-shaft-shot";
import { SetStopVulcanShotPacket } from "../../../../network/packets/set-stop-vulcan-shot";
import { SetStormHitPointShotPacket } from "../../../../network/packets/set-storm-hit-point-shot";
import { SetStormTargetShotPacket } from "../../../../network/packets/set-storm-target-shot";
import { SetStormVoidShotPacket } from "../../../../network/packets/set-storm-void-shot";
import { SetTwinsShotPacket } from "../../../../network/packets/set-twins-shot";
import { SetVulcanShotPacket } from "../../../../network/packets/set-vulcan-shot";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { IsidaState } from "../../../../utils/game/isida-state";
import { Player } from "../../../player";

export class Turret {

    private shots: number = 0;

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: ITurretProperties,
        public readonly sfx: ITurretSfx,
    ) { }

    public getName() {
        return this.item.id + '_m' + this.item.modificationID;
    }

    public handlePacket(packet: SimplePacket, tank: Tank) {
        /** RAILGUN */
        if (packet instanceof SendStartRailgunShotPacket) {
            const pk = new SetStartRailgunShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendRailgunShotPacket) {
            const pk = new SetRailgunShotPacket();
            pk.shooter = tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        /** SMOKY */

        if (packet instanceof SendSmokyHitPointShotPacket) {
            const pk = new SetSmokyHitPointPacket();
            pk.shooter = tank.player.getUsername();
            pk.hitPoint = packet.hitPoint;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendSmokyVoidShotPacket) {
            const pk = new SetSmokyVoidShotPacket();
            pk.shooter = tank.player.getUsername();

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendSmokyTargetShotPacket) {

            this.shots++;
            const isCritical = this.shots % 5 === 0;

            const pk = new SetSmokyTargetShotPacket();
            pk.shooter = tank.player.getUsername();
            pk.target = packet.target;
            pk.hitPoint = packet.hitPoint;
            pk.weakeningCoeff = 1; // TODO: see this
            pk.isCritical = isCritical;

            if (isCritical) {
                const pk = new SetSmokyCriticalEffectPacket();
                pk.target = tank.player.getUsername();
                tank.battle.broadcastPacket(pk);
            }

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        /** FLAME */

        if (packet instanceof SendStartFlameShotPacket) {
            const pk = new SetStartFlameShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendStopFlameShotPacket) {
            const pk = new SetStopFlameShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendFlameTargetsShotPacket) {
            // TODO: implement
        }

        /** THUNDER */

        if (packet instanceof SendStormVoidShotPacket) {
            const pk = new SetStormVoidShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendStormHitPointShotPacket) {
            const pk = new SetStormHitPointShotPacket();
            // TODO: implement hit wall
            pk.shooter = tank.player.getUsername();
            pk.hitPoint = packet.hitPoint;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendStormTargetShotPacket) {
            const pk = new SetStormTargetShotPacket();

            // TODO: implement hit wall
            pk.shooter = tank.player.getUsername();
            pk.target = packet.target;
            pk.relativeHitPoint = packet.relativeHitPoint;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        /** TWINS */

        if (packet instanceof SendTwinsShotPacket) {
            const pk = new SetTwinsShotPacket();
            pk.shooter = tank.player.getUsername();
            pk.barrel = packet.barrel;
            pk.shotId = packet.shotId;
            pk.shotDirection = packet.shotDirection;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendTwinsHitPointShotPacket) {
            // TODO: implement
        }

        /** ISIDA */

        if (packet instanceof SendIsisTargetShotPacket) {
            const pk = new SetIsisShotPositionPacket();
            pk.shooter = tank.player.getUsername();
            pk.state = packet.damaging ? IsidaState.DAMAGING : IsidaState.HEALING;
            pk.target = {
                direction: null,
                position: packet.position,
                byte_1: 0,
                target: packet.target
            }

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }


        if (packet instanceof SendStartIsisShotPacket) {
            const pk = new SetStartIsisShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendStopIsisShotPacket) {
            const pk = new SetStopIsisShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        /** SHOTGUN */

        if (packet instanceof SendHammerShotPacket) {
            const pk = new SetHammerShotPacket();

            pk.shooter = tank.player.getUsername();
            pk.direction = packet.direction;

            const targets: Map<string, ITarget> = new Map();

            for (const target of packet.targets) {
                if (targets.has(target.target)) {
                    targets.get(target.target).count++;
                    continue;
                }
                targets.set(target.target, {
                    direction: packet.direction,
                    hitPosition: target.position,
                    count: 1,
                    target: target.target
                })
            }

            pk.targets = Array.from(targets.values());

            tank.battle.broadcastPacket(pk);
        }

        if (packet instanceof SendHammerOverturnedShotPacket) {
            // TODO: implement
        }

        /** FREEZE */

        if (packet instanceof SendStartFreezeShootPacket) {
            const pk = new SetStartFreezeShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendStopFreezeShotPacket) {
            const pk = new SetStopFreezeShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendFreezeTargetsShotPacket) {
            // TODO: implement
        }

        /** RICOCHET */
        if (packet instanceof SendRicochetShotPacket) {
            const pk = new SetRicochetShotPacket();
            pk.shooter = tank.player.getUsername();
            pk.shotDirectionX = packet.shotDirectionX;
            pk.shotDirectionY = packet.shotDirectionY;
            pk.shotDirectionZ = packet.shotDirectionZ;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendRicochetOverturnedShotPacket) {
            // TODO: implement
        }

        if (packet instanceof SendRicochetTargetShotPacket) {
            // TODO: implement
        }

        /** MACHINEGUN */
        if (packet instanceof SendStartVulcanShotPacket) {
            const pk = new SetStartVulcanShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendStopVulcanShotPacket) {
            const pk = new SetStopVulcanShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendVulcanShotPacket) {
            const pk = new SetVulcanShotPacket();
        }

        /** SHAFT */
        if (packet instanceof SendStartShaftAimPacket) {
            const pk = new SetStartShaftShotPacket();
            pk.shooter = tank.player.getUsername();

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendOpenShaftAimPacket) {

        }

        if (packet instanceof SendShaftStopAimPacket) {
            const pk = new SetStopShaftShotPacket();
            pk.shooter = tank.player.getUsername();

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftShotPacket) {
            const pk = new SetShaftShotPacket();

            pk.shooter = tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = 10;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftAimShotPacket) {
            const pk = new SetShaftShotPacket();

            pk.shooter = tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = 10;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendMoveShaftVerticalAxisPacket) {
            const pk = new SetMoveShaftVerticalAxisPacket();
            pk.shooter = tank.player.getUsername();
            pk.projectionOnVerticalAxis = packet.projectionOnVerticalAxis;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftLocalSpotPacket) {
            const pk = new SetShaftLocalSpotPacket();
            pk.shooter = tank.player.getUsername();
            pk.target = packet.tank;
            pk.position = packet.localSpotPosition;

            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }
    }
}