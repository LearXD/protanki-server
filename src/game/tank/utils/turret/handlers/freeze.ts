import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendFreezeTargetsShotPacket } from "../../../../../network/packets/send-freeze-targets-shot";
import { SendStartFreezeShootPacket } from "../../../../../network/packets/send-start-freeze-shoot";
import { SendStopFreezeShotPacket } from "../../../../../network/packets/send-stop-freeze-shot";
import { SetStartFreezeShotPacket } from "../../../../../network/packets/set-start-freeze-shot";
import { SetStopFreezeShotPacket } from "../../../../../network/packets/set-stop-freeze-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class FreezeHandler extends Turret {

    public getTurret() {
        return Turrets.FREEZE;
    }

    public getDamagePerPeriod(): number {
        const damage = this.getSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        return damage ? parseInt(damage.value) / 2 : 0;
    }

    public getDamage(): number {
        const damage = this.getDamagePerPeriod();
        return damage;
    }

    public onDamage(target: Player, damage: number, modifiers: IDamageModifiers) {
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