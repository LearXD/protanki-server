import { TurretHandler } from "..";
import { SendMoveShaftVerticalAxisPacket } from "../../../../../network/packets/send-move-shaft-vertical-axis";
import { SendOpenShaftAimPacket } from "../../../../../network/packets/send-open-shaft-aim";
import { SendShaftAimShotPacket } from "../../../../../network/packets/send-shaft-aim-shot";
import { SendShaftLocalSpotPacket } from "../../../../../network/packets/send-shaft-local-spot";
import { SendShaftShotPacket } from "../../../../../network/packets/send-shaft-shot";
import { SendShaftStopAimPacket } from "../../../../../network/packets/send-shaft-stop-aim";
import { SendStartShaftAimPacket } from "../../../../../network/packets/send-start-shaft-aim";
import { SetMoveShaftVerticalAxisPacket } from "../../../../../network/packets/set-move-shaft-vertical-axis";
import { SetShaftLocalSpotPacket } from "../../../../../network/packets/set-shaft-local-spot";
import { SetShaftShotPacket } from "../../../../../network/packets/set-shaft-shot";
import { SetStartShaftShotPacket } from "../../../../../network/packets/set-start-shaft-shot";
import { SetStopShaftShotPacket } from "../../../../../network/packets/set-stop-shaft-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/damage/types";
import { Player } from "../../../../player";

export class ShaftHandler extends TurretHandler {

    private aiming: boolean = false;

    public getDamageRange() {
        const properties = this.item.properts.find(({ property }) => property === "DAMAGE")

        if (!properties) {
            Logger.error("Damage property not found");
            return { min: 0, max: 0 }
        }

        const min = properties.subproperties.find(({ property }) => property === "DAMAGE_TO")
        const max = properties.subproperties.find(({ property }) => property === "DAMAGE_FROM")

        if (!min || !max) {
            Logger.error("Damage to/from property not found");
            return { min: 0, max: 0 }
        }

        return {
            min: parseInt(min.value),
            max: parseInt(max.value)
        }
    }

    public getImpactForce() {
        const force = this.item.properts.find(({ property }) => property === "IMPACT_FORCE")

        if (!force) {
            Logger.error("Damage property not found");
            return 0
        }

        return parseInt(force.value)
    }

    public getMaxAimingDamage() {
        const properties = this.item.properts.find(({ property }) => property === "AIMING_MODE_DAMAGE")

        if (!properties) {
            Logger.error("Aiming damage property not found");
            return 0
        }

        const max = properties.subproperties.find(({ property }) => property === "SHAFT_AIMING_MODE_MAX_DAMAGE")
        return parseInt(max.value)
    }

    public getDamage(
        distance: number,
        modifiers: IDamageModifiers = { order: 1 }
    ): number {
        if (this.aiming) {
            const damage = this.getMaxAimingDamage();
            return damage / modifiers.order;
        }

        const range = this.getDamageRange();
        const damage = MathUtils.randomInt(range.min, range.max);

        return damage / modifiers.order;
    }

    public handleDamage(target: Player): void { }

    public handlePacket(packet: SimplePacket): void {

        if (packet instanceof SendStartShaftAimPacket) {
            this.aiming = true;
            // TODO: Validate time
        }

        if (packet instanceof SendOpenShaftAimPacket) {
            const pk = new SetStartShaftShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftStopAimPacket) {
            this.aiming = false;
            const pk = new SetStopShaftShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftShotPacket) {

            if (packet.targets && packet.targets.length > 0) {
                packet.targets = packet.targets.filter((target, i) => this.attack(target, { order: i + 1 }))
            }

            const pk = new SetShaftShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = this.getImpactForce();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftAimShotPacket) {

            if (packet.targets && packet.targets.length > 0) {
                packet.targets = packet.targets.filter((target, i) => this.attack(target, { order: i + 1 }))
            }

            const pk = new SetShaftShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = this.getImpactForce();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);

            this.aiming = false;
        }

        if (packet instanceof SendMoveShaftVerticalAxisPacket) {
            const pk = new SetMoveShaftVerticalAxisPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.projectionOnVerticalAxis = packet.projectionOnVerticalAxis;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftLocalSpotPacket) {
            const pk = new SetShaftLocalSpotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.target = packet.tank;
            pk.position = packet.localSpotPosition;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}