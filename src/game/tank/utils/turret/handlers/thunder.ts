import { TurretHandler } from "..";
import { SendStormHitPointShotPacket } from "../../../../../network/packets/send-storm-hit-point-shot";
import { SendStormTargetShotPacket } from "../../../../../network/packets/send-storm-target-shot";
import { SendStormVoidShotPacket } from "../../../../../network/packets/send-storm-void-shot";
import { SetStormHitPointShotPacket } from "../../../../../network/packets/set-storm-hit-point-shot";
import { SetStormTargetShotPacket } from "../../../../../network/packets/set-storm-target-shot";
import { SetStormVoidShotPacket } from "../../../../../network/packets/set-storm-void-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/damage/types";
import { Player } from "../../../../player";

export class ThunderHandler extends TurretHandler {

    public getDamageRange() {
        const min = this.getItemSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getItemSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: parseInt(min.value),
            max: parseInt(max.value)
        }
    }

    public getDamage(distance: number, modifiers: IDamageModifiers = { splash: false }): number {

        if (modifiers.splash) {

            if (distance >= 1000) {
                return 0;
            }

            // TODO: calculate splash damage
            return 10;
        }

        const range = this.getDamageRange();
        const damage = MathUtils.randomInt(range.min, range.max);
        return damage;
    }

    public handleDamage(target: Player): void { }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStormVoidShotPacket) {
            const pk = new SetStormVoidShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStormHitPointShotPacket) {
            this.splash(packet.hitPoint);
            const pk = new SetStormHitPointShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.hitPoint = packet.hitPoint;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStormTargetShotPacket) {
            const attacked = this.attack(packet.target);

            if (attacked) {
                this.splash(packet.hitPoint, [packet.target]);
                const pk = new SetStormTargetShotPacket();
                pk.shooter = this.tank.player.getUsername();
                pk.target = packet.target;
                pk.relativeHitPoint = packet.relativeHitPoint;
                this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
            }
        }
    }
}