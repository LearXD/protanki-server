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

    public canAttackYourself(): boolean {
        return false;
    }

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

    public attack(player: string, modifiers: IDamageModifiers = {}): boolean {
        const battle = this.tank.battle;
        const target = battle.playersManager.getPlayer(player);

        if (target) {
            modifiers.distance = target.tank.getPosition().distanceTo(this.tank.getPosition());
            modifiers.enemy = target.tank.isEnemy(this.tank);

            return battle.combatManager
                .handleAttack(target, this.tank.player, this, modifiers);
        }

        return false;
    }

    public abstract handlePacket(packet: SimplePacket): void
}