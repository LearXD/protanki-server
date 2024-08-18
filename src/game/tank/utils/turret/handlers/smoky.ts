import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendSmokyHitPointShotPacket } from "../../../../../network/packets/send-smoky-hit-point-shot";
import { SendSmokyTargetShotPacket } from "../../../../../network/packets/send-smoky-target-shot";
import { SendSmokyVoidShotPacket } from "../../../../../network/packets/send-smoky-void-shot";
import { SetSmokyCriticalEffectPacket } from "../../../../../network/packets/set-smoky-critical-effect";
import { SetSmokyHitPointPacket } from "../../../../../network/packets/set-smoky-hit-point";
import { SetSmokyTargetShotPacket } from "../../../../../network/packets/set-smoky-target-shot";
import { SetSmokyVoidShotPacket } from "../../../../../network/packets/set-smoky-void-shot";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Player } from "../../../../player";
import { Packet } from "@/network/packets/packet";

export class SmokyHandler extends Turret {

    public lastShotPacket: SendSmokyTargetShotPacket = null;

    public getTurret() {
        return Turrets.SMOKY;
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getCriticalChance(): number {
        const chance = this.getProperty("CRITICAL_HIT_CHANCE");
        return chance ? parseInt(chance.value) : 0
    }

    public getCriticalDamage(): number {
        const damage = this.getProperty("CRITICAL_HIT_DAMAGE");
        return damage ? parseInt(damage.value) : 0
    }

    public getImpactForce() {
        const force = this.getProperty("IMPACT_FORCE");
        return force ? parseInt(force.value) / 100 : 0
    }

    public getDamage(modifiers: IDamageModifiers): number {

        if (modifiers.critical) {
            return this.getCriticalDamage()
        }

        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);

        return damage
    }

    public onAttack(target: Player, modifiers?: IDamageModifiers): void {
        if (this.lastShotPacket) {
            const pk = new SetSmokyTargetShotPacket();

            pk.shooter = this.tank.player.getUsername();
            pk.target = target.getUsername();
            pk.hitPoint = this.lastShotPacket.hitPoint;
            pk.weakeningCoeff = this.getImpactForce();
            pk.isCritical = modifiers.critical

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }

    public onDamage(target: Player, damage: number, modifiers: IDamageModifiers): void {
        if (modifiers.critical) {
            const pk = new SetSmokyCriticalEffectPacket();
            pk.target = target.getUsername();
            this.tank.battle.broadcastPacket(pk);
        }
    }

    public handlePacket(packet: Packet): void {
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
            this.lastShotPacket = packet;

            this.attack(packet.target, {
                critical: MathUtils.randomInt(0, 100) <= this.getCriticalChance(),
                incarnation: packet.incarnation
            })
        }
    }
}