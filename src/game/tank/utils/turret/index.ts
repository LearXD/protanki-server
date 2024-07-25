import { Tank } from "../..";
import { IGarageItem, ITurretProperties, ITurretSfx } from "../../../../managers/garage/types";

import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Vector3d } from "../../../../utils/game/vector-3d";
import { IDamageModifiers } from "../../../battle/managers/damage/types";
import { Player } from "../../../player";

export abstract class TurretHandler {

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: ITurretProperties,
        public readonly sfx: ITurretSfx,
        public readonly tank: Tank
    ) { }

    public getName() {
        return this.item.id + '_m' + this.item.modificationID;
    }

    public abstract getDamage(distance: number, modifiers?: IDamageModifiers): number;

    public abstract handlePacket(packet: SimplePacket): void

    public abstract handleDamage(target: Player): void;

    public splash(position: Vector3d, ignore: string[] = []): void {
        const battle = this.tank.battle;
        const players = battle.getPlayersManager().getPlayers();

        for (const player of players) {

            if (ignore.includes(player.getUsername())) {
                continue;
            }

            const distance = player.getTank().getPosition().distanceTo(position);
            const damage = this.getDamage(distance, { splash: true });

            if (damage <= 0) {
                continue;
            }

            battle.getDamageManager()
                .handleAttack(this.tank.player, player, damage);
        }
    }

    public attack(target: string, modifiers?: IDamageModifiers): boolean {
        const battle = this.tank.battle;
        const player = battle.getPlayersManager().getPlayer(target);

        if (!player) return false;

        const distance = player.getTank().getPosition().distanceTo(this.tank.getPosition());
        const damage = this.getDamage(distance, modifiers);

        if (damage <= 0) {
            // idk `-`
            return true
        }

        const damaged = battle.getDamageManager()
            .handleAttack(this.tank.player, player, damage, modifiers)

        if (damaged) {
            this.handleDamage(player)
        }

        return damaged;
    }
}