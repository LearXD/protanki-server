import { Tank } from "../..";
import { IDamageModifiers } from "../../../battle/managers/combat/types";
import { Player } from "../../../player";
import { ITurretPhysics, ITurretSfx } from "@/server/managers/garage/types";
import { Turrets } from "@/states/turrets";
import { GarageItem } from "@/server/managers/garage/utils/item";
import { Logger } from "@/utils/logger";
import { ITurretResources } from "@/game/player/managers/garage/types";
import { Packet } from "@/network/packets/packet";
import { ITurretProperties } from "@/network/packets/set-turrets-data";

export abstract class Turret extends GarageItem {

    public startedAt: number = 0;
    public rotation: number = 0;

    public readonly physics: ITurretPhysics
    public readonly sfx: ITurretSfx

    public readonly properties: ITurretProperties;

    public constructor(
        readonly resources: ITurretResources,
        public readonly tank: Tank
    ) {
        super(resources.item)

        this.physics = resources.physics;
        this.sfx = resources.sfx;

        this.properties = resources.properties;
    }

    public abstract getTurret(): Turrets;
    public abstract handlePacket(packet: Packet): void

    /**
     * This function is called when the turret is attacking a player
     * @param modifiers The damage modifiers
     * @returns The damage of the turret
     */
    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        return 0
    }

    /**
     * This function is called when the turret is attacking a player
     * @param modifiers The damage modifiers
     * @returns The damage of the turret
     */
    public getHeal(): number {
        return 0
    }

    public getImpactForce(): number {
        return this.physics.impact_force
    }

    /**
     * This function is called when the turret is attacking a player
     * @returns The damage of the turret
     */
    public canAttackYourself(): boolean {
        return false;
    }

    /**
     * This function is called when the turret is attacking a player
     * @returns If the turret can attack allies
     */
    public canAttackAllies(): boolean {
        return false;
    }

    /**
     * Called when the turret is attacking a player (is called even if the damage is not valid)
     * @param target The player that is being attacked
     * @param modifiers The damage modifiers
     */
    public onAttack(target: Player, critical: boolean = false): void { }

    /**
     * This function is called when the damage is valid
     * @param target The player that is being damaged
     * @param damage The amount of damage
     * @param modifiers The damage modifiers
     */
    public onDamage(target: Player, damage: number, critical: boolean = false): void { }

    /**
     * This function is called when the turret is attacking a player
     * @param player The player that is being attacked
     * @param modifiers The damage modifiers
     * @returns If the attack was successful
     */
    public attack(player: string | Player, incarnation?: number, modifiers: IDamageModifiers = {}): boolean {
        if (this.tank.isVisible()) {
            Logger.debug(`${this.tank.player.getName()} is trying to attacking ${player instanceof Player ? player.getName() : player} with ${this.getName()}`);

            const target = player instanceof Player ? player : this.tank.battle.playersManager.getPlayer(player);

            if (target) {
                this.onAttack(target, modifiers.critical);

                if ((this.tank.player === target && this.canAttackYourself()) || target.tank.isEnemy(this.tank)) {
                    const damage = this.getDamage(target.tank.getPosition().distanceTo(this.tank.getPosition()), modifiers)
                    Logger.debug(`Attacking ${target.getName()} with ${damage} raw damage`)
                    return this.tank.battle.combatManager
                        .handleAttack(target, this.tank.player, damage, incarnation, modifiers.critical);
                }

                if (this.canAttackAllies()) {
                    return this.tank.battle.combatManager
                        .handleHeal(target, this.tank.player, this.getHeal(), incarnation);
                }
            }
        }
        return false;
    }

    /**
     * This function is called when the player is dead
     */
    public onDeath() {
        this.startedAt = 0;
        this.rotation = 0;
    }

    /**
     * This function is called on player tick
     */
    public update() { }

}