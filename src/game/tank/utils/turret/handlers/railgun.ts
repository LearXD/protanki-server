import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendRailgunShotPacket } from "../../../../../network/packets/send-railgun-shot";
import { SendStartRailgunShotPacket } from "../../../../../network/packets/send-start-railgun-shot";
import { SetRailgunShotPacket } from "../../../../../network/packets/set-railgun-shot";
import { SetStartRailgunShotPacket } from "../../../../../network/packets/set-start-railgun-shot";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Packet } from "@/network/packets/packet";
import { Player } from "@/game/player";

export class RailgunHandler extends Turret {

    public getTurret() {
        return Turrets.RAILGUN;
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
        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);
        return damage / modifiers.order;
    }

    public handlePacket(packet: Packet): void {
        if (packet instanceof SendStartRailgunShotPacket) {
            const pk = new SetStartRailgunShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendRailgunShotPacket) {

            const pk = new SetRailgunShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);

            packet.targets.forEach((target, i) => this.attack(target, packet.incarnations[i], { order: i + 1 }))
        }
    }
}