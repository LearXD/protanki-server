import { TurretHandler } from "..";
import { SendStormHitPointShotPacket } from "../../../../../network/packets/send-storm-hit-point-shot";
import { SendStormTargetShotPacket } from "../../../../../network/packets/send-storm-target-shot";
import { SendStormVoidShotPacket } from "../../../../../network/packets/send-storm-void-shot";
import { SetStormHitPointShotPacket } from "../../../../../network/packets/set-storm-hit-point-shot";
import { SetStormTargetShotPacket } from "../../../../../network/packets/set-storm-target-shot";
import { SetStormVoidShotPacket } from "../../../../../network/packets/set-storm-void-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class ThunderHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStormVoidShotPacket) {
            const pk = new SetStormVoidShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStormHitPointShotPacket) {
            const pk = new SetStormHitPointShotPacket();
            // TODO: implement hit wall
            pk.shooter = this.tank.player.getUsername();
            pk.hitPoint = packet.hitPoint;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStormTargetShotPacket) {
            const pk = new SetStormTargetShotPacket();

            // TODO: implement hit wall
            pk.shooter = this.tank.player.getUsername();
            pk.target = packet.target;
            pk.relativeHitPoint = packet.relativeHitPoint;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}