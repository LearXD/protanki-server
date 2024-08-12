import { Tank } from "../..";

import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Vector3d } from "../../../../utils/vector-3d";
import { IDamageModifiers } from "../../../battle/managers/combat/types";
import { Player } from "../../../player";
import { IGarageItem, ITurretProperties, ITurretSfx } from "@/server/managers/garage/types";
import { GarageItemUtils } from "@/game/player/managers/garage/utils/item";
import { Turrets } from "@/states/turrets";
import { GarageItem } from "@/server/managers/garage/utils/item";

export abstract class Turret extends GarageItem {

    public startedAt: number = 0;

    public rotation: number = 0;

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: ITurretProperties,
        public readonly sfx: ITurretSfx,
        public readonly tank: Tank
    ) {
        super(item)
    }

    public abstract getTurret(): Turrets;

    public getName() {
        return GarageItemUtils.serialize(this.item.id, this.item.modificationID);
    }

    public getDamage(modifiers?: IDamageModifiers): number {
        return 0
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

    // TODO: raycast to detect collision
    public splash(position: Vector3d, ignore: string[] = []): void {
        const battle = this.tank.battle;
        const players = battle.playersManager.getPlayers();

        for (const player of players) {

            if (ignore.includes(player.getUsername())) {
                continue;
            }

            const distance = player.tank.getPosition().distanceTo(position);
            const damage = this.getDamage({ distance, splash: true });

            if (damage <= 0) {
                continue;
            }

            battle.combatManager
                .handleDamage(this.tank.player, player, damage);
        }
    }

    public attack(player: string, modifiers?: IDamageModifiers): boolean {
        const battle = this.tank.battle;
        const target = battle.playersManager.getPlayer(player);

        if (!player) return false;

        const distance = target.tank.getPosition().distanceTo(this.tank.getPosition());

        modifiers = {
            ...modifiers,
            enemy: target.tank.isEnemy(this.tank),
            distance
        }

        const damage = this.getDamage(modifiers);
        if (damage === 0) {
            return true
        }

        const damaged = modifiers.enemy ?
            battle.combatManager.handleDamage(this.tank.player, target, damage, modifiers) :
            battle.combatManager.handleHeal(this.tank.player, target, damage)

        if (damaged === null) {
            return false;
        }

        if (damaged > 0) {
            if (modifiers.enemy) {
                target.tank.damage(damage, this.tank.player, modifiers.critical);
                return
            }

            target.tank.heal(damage, this.tank.player);
            return
        }

        return true;
    }

    public abstract handlePacket(packet: SimplePacket): void
}