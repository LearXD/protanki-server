import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendTwinsHitPointShotPacket } from "../../../../../network/packets/send-twins-hit-point-shot";
import { SendTwinsOverturnedShotPacket } from "../../../../../network/packets/send-twins-overturned-shot";
import { SendTwinsShotPacket } from "../../../../../network/packets/send-twins-shot";
import { SendTwinsTargetShotPacket } from "../../../../../network/packets/send-twins-target-shot";
import { SetTwinsOverturnedShotPacket } from "../../../../../network/packets/set-twins-overturned-shot";
import { SetTwinsShotPacket } from "../../../../../network/packets/set-twins-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { MathUtils } from "../../../../../utils/math";

export class TwinsHandler extends Turret {

    public getTurret() {
        return Turrets.TWINS;
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getDamage(): number {
        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);
        return damage
    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendTwinsShotPacket) {
            const pk = new SetTwinsShotPacket();

            pk.shooter = this.tank.player.getUsername();
            pk.barrel = packet.barrel;
            pk.shotId = packet.shotId;
            pk.shotDirection = packet.shotDirection;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendTwinsTargetShotPacket) {
            this.attack(packet.target, { incarnation: NaN })
        }

        if (packet instanceof SendTwinsHitPointShotPacket) {
        }

        if (packet instanceof SendTwinsOverturnedShotPacket) {
            const pk = new SetTwinsOverturnedShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.barrel = packet.barrel;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}