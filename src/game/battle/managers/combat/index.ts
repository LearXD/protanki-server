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

    public handleDamage(
        attacker: Player,
        target: Player,
        damage: number,
        modifiers: IDamageModifiers = { critical: false }
    ): number {
        if (attacker.tank.isVisible() && target.tank.isVisible()) {
            if (this.battle.isFriendlyFire() || target.tank.isEnemy(attacker.tank)) {

                if (attacker.tank.hasEffect(Supply.DOUBLE_DAMAGE)) damage *= 2;
                if (target.tank.hasEffect(Supply.ARMOR)) damage /= 2;

                const resistance = target.tank.painting.getTurretResistance(attacker.tank.turret.getTurret());
                if (resistance > 0) damage *= 1 - (resistance / 100);

                return damage;
            }
            return 0;
        }
        return null;
    }

    public handleHeal(
        healer: Player,
        target: Player,
        heal: number
    ): number {

        if (healer.tank.isVisible() && target.tank.isVisible()) {
            if (!healer.tank.isEnemy(target.tank)) {
                return heal
            }
        }

        return null;
    }
}