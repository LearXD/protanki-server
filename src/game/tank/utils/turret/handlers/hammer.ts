import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendHammerOverturnedShotPacket } from "../../../../../network/packets/send-hammer-overturned-shot";
import { SendHammerShotPacket } from "../../../../../network/packets/send-hammer-shot";
import { ITarget, SetHammerShotPacket } from "../../../../../network/packets/set-hammer-shot";
import { Vector3d } from "../../../../../utils/vector-3d";
import { Packet } from "@/network/packets/packet";

export class HammerHandler extends Turret {

    public getTurret() {
        return Turrets.HAMMER;
    }

    public getDamagePerPeriod() {
        const property = this.getSubProperty('DAMAGE_PER_SECOND', 'DAMAGE_PER_PERIOD')
        return property ? parseInt(property.value) : 0;
    }

    public getDamage(): number {
        return this.getDamagePerPeriod()
    }

    public handlePacket(packet: Packet): void {
        if (packet instanceof SendHammerShotPacket) {

            const targets: Map<string, ITarget> = new Map()
            const targetsPositions = new Map<string, Vector3d>();

            for (const target of packet.targets) {
                if (targets.has(target.target)) {
                    const shot = targets.get(target.target);
                    shot.count++;

                    shot.hitPosition.x += target.hitPosition.x;
                    shot.hitPosition.y += target.hitPosition.y;
                    shot.hitPosition.z += target.hitPosition.z;
                    continue;
                }

                targetsPositions.set(target.target, target.targetPosition);
                targets.set(target.target, {
                    direction: packet.direction,
                    hitPosition: target.hitPosition,
                    count: 1,
                    target: target.target
                })
            }

            for (const target of targets.values()) {

                const targetPosition = targetsPositions.get(target.target);

                target.hitPosition.x /= target.count;
                target.hitPosition.y /= target.count;
                target.hitPosition.z /= target.count;

                target.hitPosition.x = targetPosition.x - target.hitPosition.x;
                target.hitPosition.y = targetPosition.y - target.hitPosition.y;
                target.hitPosition.z = targetPosition.z - target.hitPosition.z;

                const attacked = this.attack(target.target, { count: target.count, incarnation: NaN });
                if (!attacked) {
                    targets.delete(target.target);
                }
            }

            const pk = new SetHammerShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.direction = packet.direction;
            pk.targets = Array.from(targets.values());
            this.tank.battle.broadcastPacket(pk);
        }

        if (packet instanceof SendHammerOverturnedShotPacket) {
            // TODO: implement
        }
    }
}