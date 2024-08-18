import { Supply } from "@/states/supply";
import { Battle } from "../..";
import { SetDamageIndicatorsPacket } from "../../../../network/packets/set-damage-indicators";
import { DamageIndicatorType } from "../../../../states/damage-indicator";
import { Player } from "../../../player";
import { IDamageModifiers } from "./types";
import { Turret } from "@/game/tank/utils/turret";
import { Logger } from "@/utils/logger";

export class BattleCombatManager {

    public static readonly DEATH_HISTERESES = 10;

    public constructor(
        private readonly battle: Battle
    ) { }

    /** OBTER O VALOR DO DANO REAL */
    public static parseDamageValue(damage: number, protection: number) {
        return damage * 10000 / protection;
    }

    /** OBTER QUANTO UM VALOR BRUTO EQUIVALE A O DANO */
    public static parseProtectionValue(protection: number, health: number) {
        return protection * health / 10000;
    }

    public handleAttack(
        target: Player,
        attacker: Player,
        turret: Turret,
        modifiers: IDamageModifiers
    ) {

        modifiers.enemy = target.tank.isEnemy(attacker.tank);

        if (
            (target === attacker && turret.canAttackYourself()) ||
            ((target !== attacker && modifiers.enemy) || turret.canAttackAllies())
        ) {

            if (!modifiers.distance) {
                modifiers.distance = target.tank.getPosition().distanceTo(attacker.tank.getPosition());
            }

            turret.onAttack(target, modifiers);

            if (Number.isNaN(modifiers.incarnation) || modifiers.incarnation === target.tank.incarnation) {
                let damage = turret.getDamage(modifiers);
                if (damage) {
                    if (attacker.tank.hasEffect(Supply.DOUBLE_DAMAGE)) {
                        damage *= 2;
                    }

                    if (modifiers.enemy) {
                        if (target.tank.hasEffect(Supply.ARMOR)) {
                            damage /= 2;
                        }

                        const resistance = target.tank.painting.getTurretResistance(attacker.tank.turret.getTurret());
                        damage *= 1 - (resistance / 100);

                        turret.onDamage(target, damage, modifiers);
                        target.tank.damage(damage, attacker, modifiers.critical);

                        return true;
                    }

                    target.tank.heal(damage, attacker);
                    return true
                }
            }
        }

        return false
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
}