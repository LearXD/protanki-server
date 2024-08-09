import { Turret } from "@/states/turret";
import { TurretHandler } from "..";
import { SendStartVulcanShotPacket } from "../../../../../network/packets/send-start-vulcan-shot";
import { SendStopVulcanShotPacket } from "../../../../../network/packets/send-stop-vulcan-shot";
import { SendVulcanOverturnedShotPacket } from "../../../../../network/packets/send-vulcan-overturned-shot";
import { SendVulcanShotPacket } from "../../../../../network/packets/send-vulcan-shot";
import { SetStartVulcanShotPacket } from "../../../../../network/packets/set-start-vulcan-shot";
import { SetStopVulcanShotPacket } from "../../../../../network/packets/set-stop-vulcan-shot";
import { ITarget, SetVulcanShotPacket } from "../../../../../network/packets/set-vulcan-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class VulcanHandler extends TurretHandler {

    public getTurret() {
        return Turret.VULCAN;
    }

    public getDamagePerPeriod(): number {
        const damage = this.getItemSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        return damage ? parseInt(damage.value) / 2 : 0
    }

    public getShotRange(): number {
        const range = this.getItemSubProperty("SHOT_RANGE", "WEAPON_MIN_DAMAGE_RADIUS");
        return range ? parseInt(range.value) : 0
    }

    public getDamage(distance: number): number {
        const damage = this.getDamagePerPeriod();
        return damage;
    }

    public handleDamaged(target: Player, damage: number, modifiers: IDamageModifiers) {
        super.handleDamage(target, damage, modifiers);
    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartVulcanShotPacket) {
            const pk = new SetStartVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopVulcanShotPacket) {
            const pk = new SetStopVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendVulcanShotPacket) {
            const targets: ITarget[] = []

            if (packet.targets && packet.targets.length > 0) {
                packet.targets.forEach(target => {
                    const attacked = this.attack(target.target)
                    if (attacked) {
                        targets.push({
                            direction: null,
                            shotPosition: target.shooterPosition,
                            byte_1: 0,
                            target: target.target
                        })
                    }
                });
            }

            const pk = new SetVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.direction = packet.direction;
            pk.targets = targets

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendVulcanOverturnedShotPacket) { }
    }
}