import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendRailgunShotPacket } from "../../../../../network/packets/send-railgun-shot";
import { SendStartRailgunShotPacket } from "../../../../../network/packets/send-start-railgun-shot";
import { SetRailgunShotPacket } from "../../../../../network/packets/set-railgun-shot";
import { SetStartRailgunShotPacket } from "../../../../../network/packets/set-start-railgun-shot";
import { MathUtils } from "../../../../../utils/math";
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Packet } from "@/network/packets/packet";

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

    public getPenetratingPower() {
        switch (this.item.modificationID) {
            case 0: return 0.3536;
            case 1: return 0.569;
            case 2: return 0.7845;
            case 3: return 1;
        }
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const range = this.getDamageRange()
        const damage = MathUtils.randomInt(range.min, range.max);
        return damage * Math.pow(this.getPenetratingPower(), modifiers.order);
    }

    public handlePacket(packet: Packet): void {

        if (packet instanceof SendStartRailgunShotPacket) {
            this.startedAt = Date.now();

            const pk = new SetStartRailgunShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendRailgunShotPacket) {

            if (this.startedAt === 0) return;

            const pk = new SetRailgunShotPacket();
            pk.shooter = this.tank.player.getName();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);

            if (packet.targets) {
                packet.targets.forEach((target, i) => this.attack(target, packet.incarnations[i], { order: i }))
            }

            this.startedAt = 0;
        }
    }
}