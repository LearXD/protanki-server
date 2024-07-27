import { TurretHandler } from "..";
import { SendSmokyHitPointShotPacket } from "../../../../../network/packets/send-smoky-hit-point-shot";
import { SendSmokyTargetShotPacket } from "../../../../../network/packets/send-smoky-target-shot";
import { SendSmokyVoidShotPacket } from "../../../../../network/packets/send-smoky-void-shot";
import { SetSmokyCriticalEffectPacket } from "../../../../../network/packets/set-smoky-critical-effect";
import { SetSmokyHitPointPacket } from "../../../../../network/packets/set-smoky-hit-point";
import { SetSmokyTargetShotPacket } from "../../../../../network/packets/set-smoky-target-shot";
import { SetSmokyVoidShotPacket } from "../../../../../network/packets/set-smoky-void-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/damage/types";
import { Player } from "../../../../player";

export class SmokyHandler extends TurretHandler {

    public getDamageRange() {
        const min = this.getItemSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getItemSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: parseInt(min.value),
            max: parseInt(max.value)
        }
    }

    public getCriticalChance(): number {
        const chance = this.getItemProperty("CRITICAL_HIT_CHANCE");
        return parseInt(chance.value)
    }

    public getCriticalDamage(): number {
        const chance = this.getItemProperty("CRITICAL_HIT_DAMAGE");
        return parseInt(chance.value)
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {

        if (modifiers.critical) {
            return this.getCriticalDamage()
        }

        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);
        Logger.debug('Distance: ' + distance + ' Damage: ' + damage);

        return damage
    }

    public handleDamage(target: Player): void { }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendSmokyHitPointShotPacket) {
            const pk = new SetSmokyHitPointPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.hitPoint = packet.hitPoint;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendSmokyVoidShotPacket) {
            const pk = new SetSmokyVoidShotPacket();
            pk.shooter = this.tank.player.getUsername();

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendSmokyTargetShotPacket) {
            const isCritical = MathUtils.randomInt(0, 100) <= this.getCriticalChance();
            const attacked = this.attack(packet.target, { critical: isCritical })

            if (attacked) {
                const pk = new SetSmokyTargetShotPacket();
                pk.shooter = this.tank.player.getUsername();
                pk.target = packet.target;
                pk.hitPoint = packet.hitPoint;
                pk.weakeningCoeff = 100; // TODO: see this
                pk.isCritical = isCritical

                if (isCritical) {
                    const pk = new SetSmokyCriticalEffectPacket();
                    pk.target = packet.target;
                    this.tank.battle.broadcastPacket(pk);
                }

                this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
            }

        }
    }
}