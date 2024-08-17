import { Tank } from "../..";
import { IDamageModifiers } from "../../../battle/managers/combat/types";
import { Player } from "../../../player";
import { ITurretProperties, ITurretSfx } from "@/server/managers/garage/types";
import { Turrets } from "@/states/turrets";
import { GarageItem } from "@/server/managers/garage/utils/item";
import { Logger } from "@/utils/logger";
import { ITurretResources } from "@/game/player/managers/garage/types";
import { Packet } from "@/network/packets/packet";

export abstract class Turret extends GarageItem {

    public startedAt: number = 0;
    public rotation: number = 0;

    public readonly properties: ITurretProperties
    public readonly sfx: ITurretSfx

    public constructor(resources: ITurretResources, public readonly tank: Tank) {
        super(resources.item)

        this.properties = resources.properties;
        this.sfx = resources.sfx;
    }

    public abstract getTurret(): Turrets;
    public abstract handlePacket(packet: Packet): void

    /**
     * This function is called when the turret is attacking a player
     * @param modifiers The damage modifiers
     * @returns The damage of the turret
     */
    public getDamage(modifiers: IDamageModifiers): number {
        return 0
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
    public onAttack(target: Player, modifiers?: IDamageModifiers): void { }

    /**
     * This function is called when the damage is valid
     * @param target The player that is being damaged
     * @param damage The amount of damage
     * @param modifiers The damage modifiers
     */
    public onDamage(target: Player, damage: number, modifiers: IDamageModifiers): void { }

    /**
     * This function is called when the turret is attacking a player
     * @param player The player that is being attacked
     * @param modifiers The damage modifiers
     * @returns If the attack was successful
     */
    public attack(player: string | Player, modifiers: IDamageModifiers): boolean {

        Logger.debug(`${this.tank.player.getUsername()} is attacking ${player instanceof Player ? player.getUsername() : player} with ${this.getName()}`);

        const battle = this.tank.battle;
        const target = player instanceof Player ? player : battle.playersManager.getPlayer(player);

        if (target) {
            return battle.combatManager
                .handleAttack(target, this.tank.player, this, modifiers);
        }

        return false;
    }

}