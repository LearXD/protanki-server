import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendFlameTargetsShotPacket } from "../../../../../network/packets/send-flame-targets-shot";
import { SendStartFlameShotPacket } from "../../../../../network/packets/send-start-flame-shot";
import { SendStopFlameShotPacket } from "../../../../../network/packets/send-stop-flame-shot";
import { SetStartFlameShotPacket } from "../../../../../network/packets/set-start-flame-shot";
import { SetStopFlameShotPacket } from "../../../../../network/packets/set-stop-flame-shot";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";
import { Packet } from "@/network/packets/packet";

export class FlamethrowerHandler extends Turret {

    public getTurret() {
        return Turrets.FLAMETHROWER;
    }

    public getMaxDamageRadius() {
        return 500; // 5m
    }

    public getMinDamageRadius() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 23.7 * multiplier;
            case 1: return 25.6 * multiplier;
            case 2: return 27.5 * multiplier;
            case 3: return 30.0 * multiplier;
        }
    }

    public getDamagePerSecond(): number {
        const damage = this.getSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        return damage ? parseInt(damage.value) : 0;
    }

    public getTemperatureDamageLimit() {
        const limit = this.getSubProperty("FIRE_DAMAGE", "FLAME_TEMPERATURE_LIMIT")
        return limit ? parseInt(limit.value) : 0;
    }

    public getHeatPerSecond(): number {
        switch (this.item.modificationID) {
            case 0: return 0.08;
            case 1: return 0.08 * 2;
            case 2: return 0.08 * 3;
            case 3: return 0.08 * 4;
        }
    }

    public getMaxHeat(): number {
        switch (this.item.modificationID) {
            case 0: return 0.3;
            case 1: return 0.3 * 2;
            case 2: return 0.3 * 3;
            case 3: return 0.3 * 4;
        }
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const damage = this.getDamagePerSecond() / 2;
        if (this.getMaxDamageRadius() >= distance) {
            return damage
        }

        const decrease = Math.min(1, 1 - ((distance - this.getMaxDamageRadius()) / this.getMinDamageRadius()));
        return damage * decrease;
    }

    public onDamage(target: Player, damage: number) {
        if (target.tank.isEnemy(this.tank)) {
            const index = damage / (this.getDamagePerSecond() / 2);
            target.tank.heat(this.getHeatPerSecond() * index, this.getMaxHeat(), this.getTemperatureDamageLimit() * index, this.tank.player);
        }
    }

    public handlePacket(packet: Packet): void {

        if (packet instanceof SendStartFlameShotPacket) {
            const pk = new SetStartFlameShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendStopFlameShotPacket) {
            const pk = new SetStopFlameShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendFlameTargetsShotPacket) {
            if (packet.targets && packet.targets.length > 0) {
                packet.targets.forEach((target, i) => this.attack(target, packet.incarnations[i]))
            }
        }
    }
}