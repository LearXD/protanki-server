import { TurretHandler } from "..";
import { SendRailgunShotPacket } from "../../../../../network/packets/send-railgun-shot";
import { SendStartRailgunShotPacket } from "../../../../../network/packets/send-start-railgun-shot";
import { SetRailgunShotPacket } from "../../../../../network/packets/set-railgun-shot";
import { SetStartRailgunShotPacket } from "../../../../../network/packets/set-start-railgun-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/damage/types";
import { Player } from "../../../../player";

export class RailgunHandler extends TurretHandler {

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const properties = this.item.properts.find(({ property }) => property === "DAMAGE")

        if (!properties) {
            Logger.error("Damage property not found");
            return 0
        }

        const damageTo = properties.subproperties.find(({ property }) => property === "DAMAGE_TO")
        const damageFrom = properties.subproperties.find(({ property }) => property === "DAMAGE_FROM")

        if (!damageTo || !damageFrom) {
            Logger.error("Damage to/from property not found");
            return 0
        }

        const damage = MathUtils.randomInt(parseInt(damageFrom.value), parseInt(damageTo.value));
        return damage / modifiers.position;
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartRailgunShotPacket) {
            const pk = new SetStartRailgunShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendRailgunShotPacket) {

            if (packet.targets && packet.targets.length > 0) {
                packet.targets.filter((target, i) => this.attack(target, { position: i + 1 }))
            }

            const pk = new SetRailgunShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}