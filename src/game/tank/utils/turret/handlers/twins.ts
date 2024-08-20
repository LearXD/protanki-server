import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendTwinsHitPointShotPacket } from "../../../../../network/packets/send-twins-hit-point-shot";
import { SendTwinsOverturnedShotPacket } from "../../../../../network/packets/send-twins-overturned-shot";
import { SendTwinsShotPacket } from "../../../../../network/packets/send-twins-shot";
import { SendTwinsTargetShotPacket } from "../../../../../network/packets/send-twins-target-shot";
import { SetTwinsOverturnedShotPacket } from "../../../../../network/packets/set-twins-overturned-shot";
import { SetTwinsShotPacket } from "../../../../../network/packets/set-twins-shot";
import { MathUtils } from "../../../../../utils/math";
import { Packet } from "@/network/packets/packet";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class TwinsHandler extends Turret {

    public getTurret() {
        return Turrets.TWINS;
    }

    public getMaxDamageRadius() {
        return 2000; // 20m
    }

    public getMinDamageRadius() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 60.7 * multiplier;
            case 1: return 65.2 * multiplier;
            case 2: return 69.8 * multiplier;
            case 3: return 75.0 * multiplier;
        }
        return 0
    }


    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const { min, max } = this.getDamageRange();
        const damage = MathUtils.randomInt(min, max)
        if (this.getMaxDamageRadius() >= distance) {
            return damage
        }

        const decrease = Math.min(1, 1 - ((distance - this.getMaxDamageRadius()) / this.getMinDamageRadius()));
        return damage * decrease;
    }

    public handlePacket(packet: Packet): void {
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