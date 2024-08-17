import { Turrets } from "@/states/turrets";
import { Turret } from "..";
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
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Player } from "../../../../player";

export class ShaftHandler extends Turret {

    private aiming: boolean = false;

    public getTurret() {
        return Turrets.SHAFT;
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getImpactForce() {
        const chance = this.getProperty("IMPACT_FORCE");
        return parseInt(chance.value)
    }

    public getMaxAimingDamage() {
        const damage = this.getSubProperty("AIMING_MODE_DAMAGE", "SHAFT_AIMING_MODE_MAX_DAMAGE")
        return parseInt(damage.value)
    }

    public getDamage(modifiers: IDamageModifiers): number {

        if (!modifiers.order) {
            modifiers.order = 1
        }

        if (this.aiming) {
            const damage = this.getMaxAimingDamage();
            return damage / modifiers.order;
        }

        const range = this.getDamageRange();
        const damage = MathUtils.randomInt(range.min, range.max);

        return damage / modifiers.order;
    }

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
                packet.targets = packet.targets.filter((target, i) => this.attack(target, { order: i + 1, incarnation: packet.incarnations[i] }))
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
                packet.targets = packet.targets.filter((target, i) => this.attack(target, { order: i + 1, incarnation: packet.incarnations[i] }))
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