import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendRailgunShotPacket } from "../../../../../network/packets/send-railgun-shot";
import { SendStartRailgunShotPacket } from "../../../../../network/packets/send-start-railgun-shot";
import { SetRailgunShotPacket } from "../../../../../network/packets/set-railgun-shot";
import { SetStartRailgunShotPacket } from "../../../../../network/packets/set-start-railgun-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Player } from "../../../../player";

export class RailgunHandler extends Turret {

    public getTurret() {
        return Turrets.RAILGUN;
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: parseInt(min.value),
            max: parseInt(max.value)
        }
    }

    public getDamage(modifiers: IDamageModifiers): number {
        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);
        return damage / modifiers.order;
    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartRailgunShotPacket) {
            const pk = new SetStartRailgunShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendRailgunShotPacket) {

            if (packet.targets && packet.targets.length > 0) {
                packet.targets = packet.targets.filter((target, i) => this.attack(target, { order: i + 1 }))
            }

            const pk = new SetRailgunShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}