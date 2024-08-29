import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendRicochetOverturnedShotPacket } from "../../../../../network/packets/send-ricochet-overturned-shot";
import { SendRicochetShotPacket } from "../../../../../network/packets/send-ricochet-shot";
import { SendRicochetTargetShotPacket } from "../../../../../network/packets/send-ricochet-target-shot";
import { SetRicochetOverturnedShotPacket } from "../../../../../network/packets/set-ricochet-overturned-shot";
import { SetRicochetShotPacket } from "../../../../../network/packets/set-ricochet-shot";
import { MathUtils } from "../../../../../utils/math";
import { Packet } from "@/network/packets/packet";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";
import { Player } from "@/game/player";
import { Logger } from "@/utils/logger";

export class RicochetHandler extends Turret {

    public getTurret() {
        return Turrets.RICOCHET;
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getMaxDistance() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 67.4 * multiplier;
            case 1: return 72.3 * multiplier;
            case 2: return 77.2 * multiplier;
            case 3: return 80.0 * multiplier;
        }
        return 0;
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);

        const max = this.getMaxDistance() * 0.9
        if (distance < max) {
            return damage;
        }

        return Math.max(0, damage / (distance / this.getMaxDistance() * 1.5));
    }

    public canAttackYourself(): boolean {
        return true;
    }

    public handlePacket(packet: Packet): void {
        if (packet instanceof SendRicochetShotPacket) {
            const pk = new SetRicochetShotPacket();
            pk.shooter = this.tank.player.getName();
            pk.shotDirectionX = packet.shotDirectionX;
            pk.shotDirectionY = packet.shotDirectionY;
            pk.shotDirectionZ = packet.shotDirectionZ;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendRicochetOverturnedShotPacket) {
            const packet = new SetRicochetOverturnedShotPacket();
            packet.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(packet, [this.tank.player.getName()]);
        }

        if (packet instanceof SendRicochetTargetShotPacket) {
            this.attack(packet.target);
        }
    }
}