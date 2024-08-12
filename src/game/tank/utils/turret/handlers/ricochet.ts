import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendRicochetOverturnedShotPacket } from "../../../../../network/packets/send-ricochet-overturned-shot";
import { SendRicochetShotPacket } from "../../../../../network/packets/send-ricochet-shot";
import { SendRicochetTargetShotPacket } from "../../../../../network/packets/send-ricochet-target-shot";
import { SetRicochetOverturnedShotPacket } from "../../../../../network/packets/set-ricochet-overturned-shot";
import { SetRicochetShotPacket } from "../../../../../network/packets/set-ricochet-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { MathUtils } from "../../../../../utils/math";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class RicochetHandler extends Turret {

    public getTurret() {
        return Turrets.RICOCHET;
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: parseInt(min.value),
            max: parseInt(max.value)
        }
    }

    public getDamage(): number {
        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);
        return damage
    }

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