import { Tank } from "../..";


import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Vector3d } from "../../../../utils/vector-3d";
import { Logger } from "../../../../utils/logger";
import { IDamageModifiers } from "../../../battle/managers/combat/types";
import { Player } from "../../../player";
import { IGarageItem, ITurretProperties, ITurretSfx } from "@/server/managers/garage/types";
import { GarageItemUtils } from "@/game/player/managers/garage/utils/item";
import { Turret } from "@/states/turret";

export abstract class TurretHandler {

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: ITurretProperties,
        public readonly sfx: ITurretSfx,
        public readonly tank: Tank
    ) { }

    public abstract getTurret(): Turret;

    public getName() {
        return GarageItemUtils.serialize(this.item.id, this.item.modificationID);
    }

    public getItemProperty(name: string) {
        return this.item.properts.find(({ property }) => property === name)
    }

    public getItemSubProperty(primary: string, secondary: string) {
        const property = this.getItemProperty(primary);

        if (!property) {
            Logger.warn(`${primary} property not found`);
            return null;
        }

        const sub = property.subproperties.find(({ property }) => property === secondary)

        if (!sub) {
            Logger.warn(`${secondary} property not found`);
            return null;
        }

        return sub;
    }

    public abstract getDamage(distance: number, modifiers?: IDamageModifiers): number;

    public abstract handlePacket(packet: SimplePacket): void

    public abstract handleDamaged(target: Player, damage: number, modifiers: IDamageModifiers): void

    public handleDamage(target: Player, damage: number, modifiers: IDamageModifiers): void {
        Logger.debug(`Turret ${this.getName()} damaging ${target.getUsername()} with ${damage} damage`);

        if (modifiers.enemy) {
            return target.tank.damage(damage, this.tank.player, modifiers.critical);
        }

        return target.tank.heal(damage, this.tank.player);

    }

    public splash(position: Vector3d, ignore: string[] = []): void {
        const battle = this.tank.battle;
        const players = battle.playersManager.getPlayers();

        for (const player of players) {

            if (ignore.includes(player.getUsername())) {
                continue;
            }

            const distance = player.tank.getPosition().distanceTo(position);
            const damage = this.getDamage(distance, { splash: true });

            if (damage <= 0) {
                continue;
            }

            battle.combatManager
                .handleDamage(this.tank.player, player, damage);
        }
    }

    public attack(target: string, modifiers: IDamageModifiers = {}): boolean {
        const battle = this.tank.battle;
        const player = battle.playersManager.getPlayer(target);

        if (!player) return false;

        modifiers.enemy = player.tank.isEnemy(this.tank);

        const distance = player.tank.getPosition().distanceTo(this.tank.getPosition());
        const damage = this.getDamage(distance, modifiers);
        Logger.debug(`Turret ${this.getName()} attacking ${player.getUsername()} with ${damage} damage`);

        if (damage === 0) {
            return true
        }

        const damaged = modifiers.enemy ?
            battle.combatManager.handleDamage(this.tank.player, player, damage, modifiers) :
            battle.combatManager.handleHeal(this.tank.player, player, damage)

        if (damaged === null) {
            return false;
        }

        if (damaged > 0) {
            this.handleDamaged(player, damaged, modifiers);
        }

        return true;
    }
}