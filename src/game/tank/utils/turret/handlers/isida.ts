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
import { IDamageModifiers } from "@/game/battle/managers/combat/types";
import { SendIsisShotPositionPacket } from "@/network/packets/send-isis-shot-position";

export class IsidaHandler extends TurretHandler {

    public startedAt: number = 0;
    public targetShot: SendIsisTargetShotPacket = null;

    public getTurret() {
        return Turret.ISIDA;
    }

    public getHealingPerPeriod(): number {
        const healing = this.getItemSubProperty("ISIS_HEALING_PER_SECOND", "ISIS_HEALING_PER_PERIOD")
        return healing ? parseInt(healing.value) : 0;
    }

    public getDamagePerPeriod(): number {
        const damage = this.getItemSubProperty("ISIS_DAMAGE", "DAMAGE_PER_PERIOD")
        return damage ? parseInt(damage.value) : 0;
    }

    public getDamage(modifiers: IDamageModifiers): number {
        if (modifiers.enemy) {
            return this.getDamagePerPeriod() / 4;
        }
        return this.getHealingPerPeriod() / 4;
    }

    public handleDamaged(target: Player, damage: number, modifiers: IDamageModifiers) {
        super.handleDamage(target, damage, modifiers);
    }

    public handlePacket(packet: SimplePacket): void {

        if (packet instanceof SendIsisTargetShotPacket) {

            this.targetShot = packet;

            if (!this.startedAt) {
                this.startedAt = Date.now()
            }

            const target = this.tank.battle.playersManager.getPlayer(packet.target);

            if (target) {
                const pk = new SetIsisTargetShotPacket();
                pk.shooter = this.tank.player.getUsername();
                pk.state = target.tank.isEnemy(this.tank) ? IsidaState.DAMAGING : IsidaState.HEALING;
                pk.target = {
                    direction: null,
                    position: packet.position,
                    hits: 0,
                    target: target.getUsername()
                }
                this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
            }
        }

        if (packet instanceof SendIsisShotPositionPacket) {
            if (this.startedAt && this.targetShot) {
                this.attack(this.targetShot.target);
            }
        }

        if (packet instanceof SendStartIsisShotPacket) {
            this.startedAt = Date.now()
            const pk = new SetStartIsisShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStopIsisShotPacket) {
            this.startedAt = 0;
            const pk = new SetStopIsisShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}