import { TurretHandler } from "..";
import { SendIsisTargetShotPacket } from "../../../../../network/packets/send-isis-target-shot";
import { SendStartIsisShotPacket } from "../../../../../network/packets/send-start-isis-shot";
import { SendStopIsisShotPacket } from "../../../../../network/packets/send-stop-isis-shot";
import { SetIsisShotPositionPacket } from "../../../../../network/packets/set-isis-shot-position";
import { SetStartIsisShotPacket } from "../../../../../network/packets/set-start-isis-shot";
import { SetStopIsisShotPacket } from "../../../../../network/packets/set-stop-isis-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { IsidaState } from "../../../../../utils/game/isida-state";
import { Player } from "../../../../player";

export class IsidaHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendIsisTargetShotPacket) {
            const pk = new SetIsisShotPositionPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.state = packet.damaging ? IsidaState.DAMAGING : IsidaState.HEALING;
            pk.target = {
                direction: null,
                position: packet.position,
                byte_1: 0,
                target: packet.target
            }

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }


        if (packet instanceof SendStartIsisShotPacket) {
            const pk = new SetStartIsisShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopIsisShotPacket) {
            const pk = new SetStopIsisShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}