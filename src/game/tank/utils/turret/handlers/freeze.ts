import { Turret } from "@/states/turret";
import { TurretHandler } from "..";
import { SendFreezeTargetsShotPacket } from "../../../../../network/packets/send-freeze-targets-shot";
import { SendStartFreezeShootPacket } from "../../../../../network/packets/send-start-freeze-shoot";
import { SendStopFreezeShotPacket } from "../../../../../network/packets/send-stop-freeze-shot";
import { SetStartFreezeShotPacket } from "../../../../../network/packets/set-start-freeze-shot";
import { SetStopFreezeShotPacket } from "../../../../../network/packets/set-stop-freeze-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class FreezeHandler extends TurretHandler {

    public getTurret() {
        return Turret.FREEZE;
    }

    public getDamagePerPeriod(): number {
        const damage = this.getItemSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        if (!damage) {
            return 0
        }
        return parseInt(damage.value) / 2
    }

    public getDamage(distance: number): number {
        const damage = this.getDamagePerPeriod();
        return damage;
    }

    public handleDamage(target: Player): void {
        const temperature = target.tank.getTemperature();
        target.tank.setTemperature(temperature - 0.1);
    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartFreezeShootPacket) {
            const pk = new SetStartFreezeShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopFreezeShotPacket) {
            const pk = new SetStopFreezeShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendFreezeTargetsShotPacket) {
            if (packet.targets && packet.targets.length > 0) {
                packet.targets.forEach(target => this.attack(target))
            }
        }
    }
}