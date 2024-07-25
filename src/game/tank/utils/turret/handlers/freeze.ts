import { TurretHandler } from "..";
import { SendFreezeTargetsShotPacket } from "../../../../../network/packets/send-freeze-targets-shot";
import { SendStartFreezeShootPacket } from "../../../../../network/packets/send-start-freeze-shoot";
import { SendStopFreezeShotPacket } from "../../../../../network/packets/send-stop-freeze-shot";
import { SetStartFreezeShotPacket } from "../../../../../network/packets/set-start-freeze-shot";
import { SetStopFreezeShotPacket } from "../../../../../network/packets/set-stop-freeze-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class FreezeHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

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
            // TODO: implement
        }
    }
}