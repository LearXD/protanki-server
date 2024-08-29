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
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Packet } from "@/network/packets/packet";
import { IShaftProperties } from "../types";

export class ShaftHandler extends Turret {

    public properties: IShaftProperties;

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

    public getMaxAimingDamage() {
        const damage = this.getSubProperty("AIMING_MODE_DAMAGE", "SHAFT_AIMING_MODE_MAX_DAMAGE")
        return parseInt(damage.value)
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const range = this.getDamageRange();

        if (this.startedAt) {
            const damage = (this.getMaxAimingDamage() - range.min) * Math.min(1, (Date.now() - this.startedAt) / this.properties.special_entity.fadeInTimeMs);
            return (damage + range.min) / modifiers.order;
        }

        const damage = MathUtils.randomInt(range.min, range.max);
        return damage / modifiers.order;
    }

    public handlePacket(packet: Packet): void {

        if (packet instanceof SendStartShaftAimPacket) {
            this.startedAt = Date.now();
        }

        if (packet instanceof SendOpenShaftAimPacket) {
            const pk = new SetStartShaftShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendShaftStopAimPacket) {
            const pk = new SetStopShaftShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
            this.startedAt = 0;
        }

        if (packet instanceof SendShaftShotPacket) {
            const pk = new SetShaftShotPacket();

            pk.shooter = this.tank.player.getName();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = this.getImpactForce();

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);

            packet.targets && packet.targets
                .forEach((target, i) => this.attack(target, packet.incarnations[i], { order: i + 1 }))

            this.startedAt = 0;
        }

        if (packet instanceof SendShaftAimShotPacket) {
            const pk = new SetShaftShotPacket();

            pk.shooter = this.tank.player.getName();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = this.getImpactForce();

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);

            packet.targets && packet.targets
                .forEach((target, i) => this.attack(target, packet.incarnations[i], { order: i + 1 }))

            this.startedAt = 0;
        }

        if (packet instanceof SendMoveShaftVerticalAxisPacket) {
            const pk = new SetMoveShaftVerticalAxisPacket();
            pk.shooter = this.tank.player.getName();
            pk.projectionOnVerticalAxis = packet.projectionOnVerticalAxis;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendShaftLocalSpotPacket) {
            const pk = new SetShaftLocalSpotPacket();
            pk.shooter = this.tank.player.getName();
            pk.target = packet.tank;
            pk.position = packet.localSpotPosition;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }
    }
}