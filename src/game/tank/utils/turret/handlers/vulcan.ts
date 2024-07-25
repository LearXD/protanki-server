import { TurretHandler } from "..";
import { SendStartVulcanShotPacket } from "../../../../../network/packets/send-start-vulcan-shot";
import { SendStopVulcanShotPacket } from "../../../../../network/packets/send-stop-vulcan-shot";
import { SendVulcanShotPacket } from "../../../../../network/packets/send-vulcan-shot";
import { SetStartVulcanShotPacket } from "../../../../../network/packets/set-start-vulcan-shot";
import { SetStopVulcanShotPacket } from "../../../../../network/packets/set-stop-vulcan-shot";
import { SetVulcanShotPacket } from "../../../../../network/packets/set-vulcan-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class VulcanHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartVulcanShotPacket) {
            const pk = new SetStartVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopVulcanShotPacket) {
            const pk = new SetStopVulcanShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendVulcanShotPacket) {
            const pk = new SetVulcanShotPacket();
        }
    }
}