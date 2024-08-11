import { Turret } from "@/states/turret";
import { TurretHandler } from "..";
import { SendTwinsHitPointShotPacket } from "../../../../../network/packets/send-twins-hit-point-shot";
import { SendTwinsOverturnedShotPacket } from "../../../../../network/packets/send-twins-overturned-shot";
import { SendTwinsShotPacket } from "../../../../../network/packets/send-twins-shot";
import { SendTwinsTargetShotPacket } from "../../../../../network/packets/send-twins-target-shot";
import { SetTwinsOverturnedShotPacket } from "../../../../../network/packets/set-twins-overturned-shot";
import { SetTwinsShotPacket } from "../../../../../network/packets/set-twins-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { MathUtils } from "../../../../../utils/math";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class TwinsHandler extends TurretHandler {

    public getTurret() {
        return Turret.TWINS;
    }

    public getDamageRange() {
        const min = this.getItemSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getItemSubProperty("DAMAGE", "DAMAGE_TO")

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

    public handleDamaged(target: Player, damage: number, modifiers: IDamageModifiers) {
        super.handleDamage(target, damage, modifiers);
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
            this.attack(packet.target)
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