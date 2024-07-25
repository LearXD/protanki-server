import { TurretHandler } from "..";
import { SendHammerOverturnedShotPacket } from "../../../../../network/packets/send-hammer-overturned-shot";
import { SendHammerShotPacket } from "../../../../../network/packets/send-hammer-shot";
import { ITarget, SetHammerShotPacket } from "../../../../../network/packets/set-hammer-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class HammerHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendHammerShotPacket) {
            const pk = new SetHammerShotPacket();

            pk.shooter = this.tank.player.getUsername();
            pk.direction = packet.direction;

            const targets: Map<string, ITarget> = new Map();

            for (const target of packet.targets) {
                if (targets.has(target.target)) {
                    targets.get(target.target).count++;
                    continue;
                }
                targets.set(target.target, {
                    direction: packet.direction,
                    hitPosition: target.position,
                    count: 1,
                    target: target.target
                })
            }

            pk.targets = Array.from(targets.values());

            this.tank.battle.broadcastPacket(pk);
        }

        if (packet instanceof SendHammerOverturnedShotPacket) {
            // TODO: implement
        }
    }
}