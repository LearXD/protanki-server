import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendFreezeTargetsShotPacket } from "../../../../../network/packets/send-freeze-targets-shot";
import { SendStartFreezeShootPacket } from "../../../../../network/packets/send-start-freeze-shoot";
import { SendStopFreezeShotPacket } from "../../../../../network/packets/send-stop-freeze-shot";
import { SetStartFreezeShotPacket } from "../../../../../network/packets/set-start-freeze-shot";
import { SetStopFreezeShotPacket } from "../../../../../network/packets/set-stop-freeze-shot";
import { Player } from "../../../../player";
import { IDamageModifiers } from "@/game/battle/managers/combat/types";
import { Packet } from "@/network/packets/packet";

export class FreezeHandler extends Turret {

    public getTurret() {
        return Turrets.FREEZE;
    }

    public getDamagePerPeriod(): number {
        const damage = this.getSubProperty("DAMAGE_PER_SECOND", "DAMAGE_PER_PERIOD");
        return damage ? parseInt(damage.value) / 2 : 0;
    }

    public getFreezePerSecond(): number {
        const base = -0.15
        switch (this.item.modificationID) {
            case 0: return base
            case 1: return base * 2;
            case 2: return base * 3;
            case 3: return base * 4;
        }
    }

    public getMaxFreeze(): number {
        const base = -1
        switch (this.item.modificationID) {
            case 0: return base
            case 1: return base * 2;
            case 2: return base * 3;
            case 3: return base * 4;
        }
    }

    public getDamage(): number {
        const damage = this.getDamagePerPeriod();
        // return damage;
        return 0
    }

    public onAttack(target: Player, modifiers?: IDamageModifiers): void {
        target.tank.heat(this.getFreezePerSecond(), this.getMaxFreeze(), 0, this.tank.player);
    }

    public handlePacket(packet: Packet): void {
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
            if (packet.targets && packet.targets.length > 0) {
                packet.targets.forEach((target, i) => this.attack(target, { incarnation: packet.incarnations[i] }))
            }
        }
    }
}