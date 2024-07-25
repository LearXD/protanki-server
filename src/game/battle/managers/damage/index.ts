import { Battle } from "../..";
import { SetDamageIndicatorsPacket } from "../../../../network/packets/set-damage-indicators";
import { SetTankDestroyedPacket } from "../../../../network/packets/set-tank-destroyed";
import { DamageIndicator, DamageIndicatorType } from "../../../../utils/game/damage-indicator";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";
import { IDamageModifiers } from "./types";

export class BattleDamageManager {

    public constructor(
        private readonly battle: Battle
    ) { }


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

        if (!target.getTank().isAlive() || !attacker.getTank().isAlive()) {
            return false;
        }

        const damage = turretDamage * 10000 / target.getTank().getHull().getProtection();
        const health = target.getTank().getHealth();
        const newHealth = health - damage;

        Logger.debug('')
        Logger.debug(`Attacker: ${attacker.getUsername()} attacked ${target.getUsername()} with ${damage} (${damage}) damage.`);
        Logger.debug(`Target health: ${target.getTank().getHealth()} New health: ${newHealth}`);
        Logger.debug('')

        target.getTank().setHealth(newHealth);

        if (newHealth <= 0) {
            target.getTank().kill(attacker)
            this.sendDamageIndicator(attacker, target, health, DamageIndicator.FATAL);
            return true;
        }

        this.sendDamageIndicator(attacker, target, turretDamage, modifiers.critical ? DamageIndicator.CRITICAL : DamageIndicator.NORMAL);
        return true;
    }
}