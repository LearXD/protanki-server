import { Supply } from "@/states/supply";
import { Battle } from "../..";
import { SetDamageIndicatorsPacket } from "../../../../network/packets/set-damage-indicators";
import { DamageIndicatorType } from "../../../../states/damage-indicator";
import { Player } from "../../../player";
import { IDamageModifiers } from "./types";
import { Logger } from "@/utils/logger";
import { TimeType } from "../task/types";

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

    public checkIncarnation(player: Player, incarnation: number) {
        return typeof incarnation !== "number" || player.tank.incarnation === incarnation
    }

    public handleHeal(
        target: Player,
        healer: Player,
        heal: number,
        incarnation: number
    ) {
        if (heal) {
            if (this.checkIncarnation(target, incarnation) && target.tank.isVisible()) {
                target.tank.heal(heal, healer);
                return true;
            }
        }
        return false;
    }

    public handleAttack(
        target: Player,
        attacker: Player,
        damage: number,
        incarnation: number,
        critical: boolean = false
    ) {
        if (damage) {
            if (this.checkIncarnation(target, incarnation) && target.tank.isVisible()) {

                if (attacker.tank.hasEffect(Supply.DOUBLE_DAMAGE)) damage *= 2

                const resistance = target.tank.painting.getTurretResistance(attacker.tank.turret.getTurret());
                damage *= 1 - (resistance / 100);

                attacker.tank.turret.onDamage(target, damage);

                Logger.debug(`Attacking ${target.getUsername()} with ${damage} damage`)
                target.tank.damage(damage, attacker, critical);
                return true
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