import { Battle } from "../..";
import { SetDamageIndicatorsPacket } from "../../../../network/packets/set-damage-indicators";
import { DamageIndicator, DamageIndicatorType } from "../../../../states/damage-indicator";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";
import { IDamageModifiers } from "./types";

export class BattleCombatManager {

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

    public handleKill(target: Player, killer?: Player) {
        if (killer && killer.getUsername() !== target.getUsername()) {
            this.battle.getStatisticsManager().increaseKill(killer);
            this.battle.getStatisticsManager().addScore(target, 20);
        }
        this.battle.getStatisticsManager().increaseDeath(target);
    }

    public handleAttack(
        attacker: Player,
        target: Player,
        turretDamage: number,
        modifiers: IDamageModifiers = { critical: false }
    ): boolean {

        if (!target.getTank().isVisible()) {
            return false;
        }

        if (!attacker.getTank().isVisible()) {
            return false;
        }

        const protection = target.getTank().getHull().getProtection();
        const health = target.getTank().getHealth();

        const damage = turretDamage * 10000 / protection;
        const newHealth = health - damage;

        Logger.debug('')
        Logger.debug(`Attacker: ${attacker.getUsername()} attacked ${target.getUsername()}`);
        Logger.debug(`Damage: ${turretDamage} (${damage})`);
        Logger.debug(`Target health: ${health}`);
        Logger.debug(`New health: ${newHealth}`);
        Logger.debug(`Protection: ${protection}`);
        Logger.debug(`${attacker.getUsername()} position ${attacker.getTank().getPosition().toString()}`);
        Logger.debug(`${target.getUsername()} position ${target.getTank().getPosition().toString()}`);
        Logger.debug('')

        target.getTank().setHealth(newHealth);

        // TODO: check this if
        if (newHealth <= 10) {
            this.handleKill(target, attacker);
            target.getTank().kill(attacker)
            this.sendDamageIndicator(attacker, target, protection * health / 10000, DamageIndicator.FATAL);
            return true;
        }

        this.sendDamageIndicator(attacker, target, turretDamage, modifiers.critical ? DamageIndicator.CRITICAL : DamageIndicator.NORMAL);
        return true;
    }
}