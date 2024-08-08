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

        if (!(target.tank.isVisible() && attacker.tank.isVisible())) {
            return false;
        }

        const protection = target.tank.hull.getProtection();
        const health = target.tank.getHealth();

        if (attacker.tank.hasEffect(Supply.DOUBLE_DAMAGE)) {
            Logger.debug(`Has double damage`);
            turretDamage *= 2;
        }

        if (target.tank.hasEffect(Supply.ARMOR)) {
            Logger.debug(`Has damage reduction`);
            turretDamage /= 2;
        }

        const resistance = target.tank.painting.getTurretResistance(attacker.tank.turret.getTurret());
        if (resistance > 0) {
            Logger.debug(`Has resistance to ${attacker.tank.turret.getTurret()}. Resistance: ${resistance}%`);
            turretDamage *= 1 - (resistance / 100);
        }

        let damage = BattleCombatManager.parseDamageValue(turretDamage, protection)
        target.tank.setHealth(health - damage);

        const isDead = target.tank.getHealth() <= BattleCombatManager.DEATH_HISTERESES;

        Logger.debug('')
        Logger.debug(`Attacker: ${attacker.getUsername()} attacked ${target.getUsername()}`);
        Logger.debug(`Damage: ${turretDamage} (${damage})`);
        Logger.debug(`Target health: ${health}`);
        Logger.debug(`New health: ${target.tank.getHealth()}`);
        Logger.debug(`Protection: ${protection}`);
        Logger.debug(`${attacker.getUsername()} position ${attacker.tank.getPosition().toString()}`);
        Logger.debug(`${target.getUsername()} position ${target.tank.getPosition().toString()}`);
        Logger.debug('')

        // TODO: check this if
        if (isDead) {
            target.tank.kill(attacker)
            this.sendDamageIndicator(attacker, target, BattleCombatManager.parseProtectionValue(protection, health), DamageIndicator.FATAL);
            return true;
        }

        this.sendDamageIndicator(attacker, target, turretDamage, modifiers.critical ? DamageIndicator.CRITICAL : DamageIndicator.NORMAL);
        return true;
    }
}