import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendIsisTargetShotPacket } from "../../../../../network/packets/send-isis-target-shot";
import { SendStartIsisShotPacket } from "../../../../../network/packets/send-start-isis-shot";
import { SendStopIsisShotPacket } from "../../../../../network/packets/send-stop-isis-shot";
import { SetIsisTargetShotPacket } from "../../../../../network/packets/set-isis-target-shot";
import { SetStartIsisShotPacket } from "../../../../../network/packets/set-start-isis-shot";
import { SetStopIsisShotPacket } from "../../../../../network/packets/set-stop-isis-shot";
import { IsidaState } from "../../../../../states/isida-state";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";
import { SendIsisShotPositionPacket } from "@/network/packets/send-isis-shot-position";
import { Packet } from "@/network/packets/packet";
import { Player } from "@/game/player";

export class IsidaHandler extends Turret {

    public startedAt: number = 0;
    public targetShot: SendIsisTargetShotPacket = null;

    public getTurret() {
        return Turrets.ISIDA;
    }

    public getHealingPerPeriod(): number {
        const healing = this.getSubProperty("ISIS_HEALING_PER_SECOND", "ISIS_HEALING_PER_PERIOD")
        return healing ? parseInt(healing.value) : 0;
    }

    public getDamagePerPeriod(): number {
        const damage = this.getSubProperty("ISIS_DAMAGE", "DAMAGE_PER_PERIOD")
        return damage ? parseInt(damage.value) : 0;
    }

    public getSelfHealingPercent(): number {
        const heal = this.getProperty("ISIS_SELF_HEALING_PERCENT")
        return heal ? parseInt(heal.value) : 0;
    }

    public getHeal(): number {
        return this.getHealingPerPeriod() / 2;
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        return this.getDamagePerPeriod() / 2;
    }

    public canAttackAllies(): boolean {
        return true;
    }

    public onDamage(target: Player, damage: number): void {
        if (target.tank.isEnemy(this.tank)) {
            this.tank.heal(damage * (this.getSelfHealingPercent() / 100));
        }
    }

    public handlePacket(packet: Packet): void {

        if (packet instanceof SendIsisTargetShotPacket) {

            this.targetShot = packet;

            if (!this.startedAt) {
                this.startedAt = Date.now()
            }

            const target = this.tank.battle.playersManager.getPlayer(packet.target);

            if (target) {
                const pk = new SetIsisTargetShotPacket();
                pk.shooter = this.tank.player.getName();
                pk.state = target.tank.isEnemy(this.tank) ? IsidaState.DAMAGING : IsidaState.HEALING;
                pk.target = {
                    direction: null,
                    position: packet.position,
                    hits: 0,
                    target: target.getName()
                }
                this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
            }
        }

        if (packet instanceof SendIsisShotPositionPacket) {
            if (this.startedAt && this.targetShot) {
                this.attack(this.targetShot.target, packet.incarnation);
            }
        }

        if (packet instanceof SendStartIsisShotPacket) {
            this.startedAt = Date.now()
            const pk = new SetStartIsisShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }

        if (packet instanceof SendStopIsisShotPacket) {
            this.startedAt = 0;
            const pk = new SetStopIsisShotPacket();
            pk.shooter = this.tank.player.getName();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getName()]);
        }
    }
}