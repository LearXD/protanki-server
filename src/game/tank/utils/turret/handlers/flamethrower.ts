import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendFlameTargetsShotPacket } from "../../../../../network/packets/send-flame-targets-shot";
import { SendStartFlameShotPacket } from "../../../../../network/packets/send-start-flame-shot";
import { SendStopFlameShotPacket } from "../../../../../network/packets/send-stop-flame-shot";
import { SetStartFlameShotPacket } from "../../../../../network/packets/set-start-flame-shot";
import { SetStopFlameShotPacket } from "../../../../../network/packets/set-stop-flame-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class FlamethrowerHandler extends Turret {

    public getTurret() {
        return Turrets.FLAMETHROWER;
    }

    public getDamagePerSecond(): number {
        const damage = this.getSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        return damage ? parseInt(damage.value) / 2 : 0;
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

    public getDamage(): number {
        return this.getDamagePerSecond();
    }

    public onDamage(target: Player, damage: number, modifiers: IDamageModifiers) {
        if (modifiers.enemy) {
            target.tank.heat(this.getHeatPerSecond(), this.getMaxHeat(), this.getTemperatureDamageLimit(), this.tank.player);
        }
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
                packet.targets.forEach((target, i) => this.attack(target, { incarnation: packet.incarnations[i] }))
            }
        }
    }
}