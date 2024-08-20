import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendStartVulcanShotPacket } from "../../../../../network/packets/send-start-vulcan-shot";
import { SendStopVulcanShotPacket } from "../../../../../network/packets/send-stop-vulcan-shot";
import { SendVulcanOverturnedShotPacket } from "../../../../../network/packets/send-vulcan-overturned-shot";
import { SendVulcanShotPacket } from "../../../../../network/packets/send-vulcan-shot";
import { SetStartVulcanShotPacket } from "../../../../../network/packets/set-start-vulcan-shot";
import { SetStopVulcanShotPacket } from "../../../../../network/packets/set-stop-vulcan-shot";
import { ITarget, SetVulcanShotPacket } from "../../../../../network/packets/set-vulcan-shot";
import { Packet } from "@/network/packets/packet";
import { IMachinegunProperties } from "../types";

export class VulcanHandler extends Turret {

    public properties: IMachinegunProperties;

    public getTurret() {
        return Turrets.VULCAN;
    }

    public getMaxDamageRadius() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 31.8 * multiplier;
            case 1: return 36.5 * multiplier;
            case 2: return 39.4 * multiplier;
            case 3: return 45.9 * multiplier;
        }
    }

    public getMinDamageRadius() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 149.6 * multiplier;
            case 1: return 169.0 * multiplier;
            case 2: return 188.4 * multiplier;
            case 3: return 205.0 * multiplier;
        }
    }

    public getMaxHeat(): number {
        switch (this.item.modificationID) {
            case 0: return 0.3;
            case 1: return 0.6;
            case 2: return 0.81;
            case 3: return 1;
        }
        return 0
    }

    public getHeatPerSecond(): number {
        switch (this.item.modificationID) {
            case 0: return 0.09;
            case 1: return 0.15;
            case 2: return 0.20;
            case 3: return 0.25;
        }
        return 0
    }

    public getDamagePerPeriod(): number {
        const damage = this.getSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        return damage ? parseInt(damage.value) : 0
    }

    public getShotRange(): number {
        const range = this.getSubProperty("SHOT_RANGE", "WEAPON_MIN_DAMAGE_RADIUS");
        return range ? parseInt(range.value) : 0
    }

    public getDamage(distance: number): number {
        const damage = this.getDamagePerPeriod() / 4;
        if (this.getMaxDamageRadius() >= distance) {
            return damage
        }

        const decrease = Math.min(1, 1 - ((distance - this.getMaxDamageRadius()) / this.getMinDamageRadius()));
        return damage * decrease;
    }

    public update() {
        if (this.startedAt) {
            const time = Date.now() - this.startedAt
            if (time > (this.properties.special_entity.temperatureHittingTime + 1000)) {
                this.tank.heat(this.getHeatPerSecond(), this.getMaxHeat(), this.getDamagePerPeriod() / 2, this.tank.player)
            }
        }
    }

    public handlePacket(packet: Packet): void {
        if (packet instanceof SendStartVulcanShotPacket) {
            this.startedAt = Date.now();

            const pk = new SetStartVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopVulcanShotPacket) {
            this.startedAt = 0;

            const pk = new SetStopVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendVulcanShotPacket) {
            const targets: ITarget[] = []

            if (packet.targets && packet.targets.length > 0) {
                packet.targets.forEach(target => {
                    targets.push({ direction: null, shotPosition: target.shooterPosition, hits: 0, target: target.target })
                });
            }

            const pk = new SetVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.direction = packet.direction;
            pk.targets = targets
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);

            packet.targets.forEach(target => this.attack(target.target))
        }

        if (packet instanceof SendVulcanOverturnedShotPacket) { }
    }
}