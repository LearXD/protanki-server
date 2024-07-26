import { TurretHandler } from "..";
import { SendTwinsHitPointShotPacket } from "../../../../../network/packets/send-twins-hit-point-shot";
import { SendTwinsShotPacket } from "../../../../../network/packets/send-twins-shot";
import { SetTwinsShotPacket } from "../../../../../network/packets/set-twins-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class TwinsHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendTwinsShotPacket) {
            const pk = new SetTwinsShotPacket();

            pk.shooter = this.tank.player.getUsername();
            pk.barrel = packet.barrel;
            pk.shotId = packet.shotId;
            pk.shotDirection = packet.shotDirection;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendTwinsHitPointShotPacket) { // SetTwinsShotPacket -> SetTwinsHitPointShotPacket
            // TODO: implement
        }
    }
}