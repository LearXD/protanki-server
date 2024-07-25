import { TurretHandler } from "..";
import { SendRicochetOverturnedShotPacket } from "../../../../../network/packets/send-ricochet-overturned-shot";
import { SendRicochetShotPacket } from "../../../../../network/packets/send-ricochet-shot";
import { SendRicochetTargetShotPacket } from "../../../../../network/packets/send-ricochet-target-shot";
import { SetRicochetOverturnedShotPacket } from "../../../../../network/packets/set-ricochet-overturned-shot";
import { SetRicochetShotPacket } from "../../../../../network/packets/set-ricochet-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { Player } from "../../../../player";

export class RicochetHandler extends TurretHandler {

    public getDamage(distance: number): number {
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
        return damage
    }

    public handleDamage(target: Player): void { }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendRicochetShotPacket) {
            const pk = new SetRicochetShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.shotDirectionX = packet.shotDirectionX;
            pk.shotDirectionY = packet.shotDirectionY;
            pk.shotDirectionZ = packet.shotDirectionZ;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendRicochetOverturnedShotPacket) {
            const packet = new SetRicochetOverturnedShotPacket();
            packet.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(packet, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendRicochetTargetShotPacket) {
            this.attack(packet.target);
        }
    }
}