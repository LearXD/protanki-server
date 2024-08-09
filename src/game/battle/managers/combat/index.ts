import { Supply } from "@/states/supply";
import { Battle } from "../..";
import { SetDamageIndicatorsPacket } from "../../../../network/packets/set-damage-indicators";
import { DamageIndicator, DamageIndicatorType } from "../../../../states/damage-indicator";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";
import { IDamageModifiers } from "./types";

export class BattleCombatManager {

    public static readonly DEATH_HISTERESES = 10;

    public constructor(
        private readonly battle: Battle
    ) { }

    /** OBTER O VALOR DO DANO REAL */
    public static parseDamageValue(
        damage: number,
        protection: number
    ) {
        return damage * 10000 / protection;
    }

    /** OBTER QUANTO UM VALOR BRUTO EQUIVALE A O DANO */
    public static parseProtectionValue(
        protection: number,
        health: number
    ) {
        return protection * health / 10000;
    }

    public sendDamageIndicator(
        player: Player,
        target: Player,
        damage: number,
        type: DamageIndicatorType
    ) {
        const packet = new SetDamageIndicatorsPacket();
        packet.indicators = [{ target: target.getUsername(), damage, type }];
        player.sendPacket(packet);
    }

    public handleAttack(
        attacker: Player,
        target: Player,
        turretDamage: number,
        modifiers: IDamageModifiers = { critical: false }
    ): boolean {
        if (attacker.tank.isVisible() && target.tank.isVisible()) {
            if (this.battle.isFriendlyFire() || target.tank.isEnemy(attacker.tank)) {

                if (attacker.tank.hasEffect(Supply.DOUBLE_DAMAGE)) turretDamage *= 2;
                if (target.tank.hasEffect(Supply.ARMOR)) turretDamage /= 2;

                const resistance = target.tank.painting.getTurretResistance(attacker.tank.turret.getTurret());
                if (resistance > 0) turretDamage *= 1 - (resistance / 100);

                target.tank.damage(turretDamage, attacker, modifiers.critical);
                return true;
            }
        }
        return false;
    }

    public handleHeal(
        healer: Player,
        target: Player,
        heal: number
    ): boolean {

        if (healer.tank.isVisible() && target.tank.isVisible()) {
            if (!healer.tank.isEnemy(target.tank)) {
                target.tank.heal
            }
        }

        const health = target.tank.getHealth();
        target.tank.setHealth(health + heal);

        this.sendDamageIndicator(healer, target, heal, DamageIndicator.HEAL);
        return true;
    }
}