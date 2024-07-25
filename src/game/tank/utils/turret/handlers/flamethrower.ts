import { TurretHandler } from "..";
import { SendFlameTargetsShotPacket } from "../../../../../network/packets/send-flame-targets-shot";
import { SendStartFlameShotPacket } from "../../../../../network/packets/send-start-flame-shot";
import { SendStopFlameShotPacket } from "../../../../../network/packets/send-stop-flame-shot";
import { SetStartFlameShotPacket } from "../../../../../network/packets/set-start-flame-shot";
import { SetStopFlameShotPacket } from "../../../../../network/packets/set-stop-flame-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Logger } from "../../../../../utils/logger";
import { Player } from "../../../../player";

export class FlamethrowerHandler extends TurretHandler {

    public getDamagePerSecond(): number {
        const properties = this.item.properts.find(({ property }) => property === "DAMAGE_PER_SECOND")

        if (!properties) {
            Logger.warn("Damage per second property not found");
            return 0
        }

        const damage = properties.subproperties.find(({ property }) => property === "DAMAGE_PER_PERIOD")

        if (!damage) {
            Logger.warn("Damage per period property not found");
            return 0
        }

        return parseInt(damage.value)
    }

    public getTemperatureLimit() {
        const properties = this.item.properts.find(({ property }) => property === "FIRE_DAMAGE")

        if (!properties) {
            Logger.warn("Fire damage property not found");
            return 0
        }

        const limit = properties.subproperties.find(({ property }) => property === "FLAME_TEMPERATURE_LIMIT")

        if (!limit) {
            Logger.warn("Flame temperature limit property not found");
            return 0
        }

        return parseInt(limit.value)
    }

    public getDamage(distance: number): number {
        const damage = this.getDamagePerSecond();

        return damage;
    }

    public handleDamage(target: Player): void {
        const temperatureLimit = this.getTemperatureLimit();
        const temperature = target.getTank().getTemperature();

        if (temperature >= temperatureLimit) {
            return;
        }

        target.getTank().setTemperature(
            temperature + 1 > temperatureLimit ? temperatureLimit : temperature + 1
        )
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