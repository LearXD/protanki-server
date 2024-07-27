import { TurretHandler } from "..";
import { SendIsisTargetShotPacket } from "../../../../../network/packets/send-isis-target-shot";
import { SendStartIsisShotPacket } from "../../../../../network/packets/send-start-isis-shot";
import { SendStopIsisShotPacket } from "../../../../../network/packets/send-stop-isis-shot";
import { SetIsisTargetShotPacket } from "../../../../../network/packets/set-isis-target-shot";
import { SetStartIsisShotPacket } from "../../../../../network/packets/set-start-isis-shot";
import { SetStopIsisShotPacket } from "../../../../../network/packets/set-stop-isis-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { IsidaState } from "../../../../../states/isida-state";
import { Player } from "../../../../player";

export class IsidaHandler extends TurretHandler {

    public getHealingPerPeriod(): number {
        const healing = this.getItemSubProperty("SIS_HEALING_PER_SECOND", "ISIS_HEALING_PER_PERIOD")
        return parseInt(healing.value) / 2;
    }

    public getDamagePerPeriod(): number {
        const healing = this.getItemSubProperty("ISIS_DAMAGE", "DAMAGE_PER_PERIOD")
        return parseInt(healing.value) / 2;
    }

    public getDamage(): number {
        return this.getDamagePerPeriod();
    }

    public handleDamage(target: Player): void { }

    /** 
    static SEND_ISIS_SHOT_POSITION = 244072998;
     */

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendIsisTargetShotPacket) {

            const attacked = this.attack(packet.target);

            if (attacked) {
                const pk = new SetIsisTargetShotPacket();
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