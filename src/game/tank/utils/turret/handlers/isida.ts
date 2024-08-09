import { Turret } from "@/states/turret";
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
import { Vector3d } from "@/utils/vector-3d";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";

export class IsidaHandler extends TurretHandler {

    public lastShot: SendIsisTargetShotPacket = null;

    public getTurret() {
        return Turret.ISIDA;
    }

    public getHealingPerPeriod(): number {
        const healing = this.getItemSubProperty("ISIS_HEALING_PER_SECOND", "ISIS_HEALING_PER_PERIOD")
        return parseInt(healing.value) / 2;
    }

    public getDamagePerPeriod(): number {
        const healing = this.getItemSubProperty("ISIS_DAMAGE", "DAMAGE_PER_PERIOD")
        return parseInt(healing.value) / 2;
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        if (modifiers.enemy) {
            return this.getDamagePerPeriod();
        }
        return this.getHealingPerPeriod();
    }

    public handleDamaged(target: Player, damage: number, modifiers: IDamageModifiers) {

        if (!this.lastShot) {
            return;
        }

        const pk = new SetIsisTargetShotPacket();
        pk.shooter = this.tank.player.getUsername();
        pk.state = modifiers.enemy ? IsidaState.DAMAGING : IsidaState.HEALING;
        pk.target = {
            direction: null,
            position: this.lastShot.position,
            byte_1: 0,
            target: target.getUsername()
        }

        this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);

        super.handleDamage(target, damage, modifiers);
    }

    /** 
    static SEND_ISIS_SHOT_POSITION = 244072998;
     */

    public handlePacket(packet: SimplePacket): void {

        if (packet instanceof SendIsisTargetShotPacket) {
            this.lastShot = packet;
            this.attack(packet.target);
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