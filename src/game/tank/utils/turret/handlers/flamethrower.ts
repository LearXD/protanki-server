import { Turret } from "@/states/turret";
import { TurretHandler } from "..";
import { SendFlameTargetsShotPacket } from "../../../../../network/packets/send-flame-targets-shot";
import { SendStartFlameShotPacket } from "../../../../../network/packets/send-start-flame-shot";
import { SendStopFlameShotPacket } from "../../../../../network/packets/send-stop-flame-shot";
import { SetStartFlameShotPacket } from "../../../../../network/packets/set-start-flame-shot";
import { SetStopFlameShotPacket } from "../../../../../network/packets/set-stop-flame-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class FlamethrowerHandler extends TurretHandler {

    public getTurret() {
        return Turret.FLAMETHROWER;
    }

    public getDamagePerSecond(): number {
        const damage = this.getItemSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        if (!damage) {
            return 0
        }
        return parseInt(damage.value) / 2
    }

    public getTemperatureLimit() {
        const limit = this.getItemSubProperty("FIRE_DAMAGE", "FLAME_TEMPERATURE_LIMIT")
        if (!limit) {
            return 0
        }
        return parseInt(limit.value)
    }

    public getDamage(): number {
        const damage = this.getDamagePerSecond();

        return damage;
    }

    public handleDamaged(target: Player, damage: number, modifiers: IDamageModifiers) {
        super.handleDamage(target, damage, modifiers);

        const temperatureLimit = this.getTemperatureLimit();
        const temperature = target.tank.getTemperature();

        if (temperature >= temperatureLimit) {
            return;
        }

        target.tank.setTemperature(temperature + 0.1)
    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartFlameShotPacket) {
            const pk = new SetStartFlameShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopFlameShotPacket) {
            const pk = new SetStopFlameShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendFlameTargetsShotPacket) {
            if (packet.targets && packet.targets.length > 0) {
                packet.targets.forEach(target => this.attack(target))
            }
        }
    }
}