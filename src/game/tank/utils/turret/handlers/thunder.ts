import { Turrets } from "@/states/turrets";
import { Turret } from "..";
import { SendStormHitPointShotPacket } from "../../../../../network/packets/send-storm-hit-point-shot";
import { SendStormTargetShotPacket } from "../../../../../network/packets/send-storm-target-shot";
import { SendStormVoidShotPacket } from "../../../../../network/packets/send-storm-void-shot";
import { SetStormHitPointShotPacket } from "../../../../../network/packets/set-storm-hit-point-shot";
import { SetStormTargetShotPacket } from "../../../../../network/packets/set-storm-target-shot";
import { SetStormVoidShotPacket } from "../../../../../network/packets/set-storm-void-shot";
import { IDamageModifiers } from "../../../../battle/managers/combat/types";
import { Vector3d } from "@/utils/vector-3d";
import { RayHit } from "@/game/map/managers/collision/utils/rayhit";
import { Logger } from "@/utils/logger";
import { Packet } from "@/network/packets/packet";
import { MathUtils } from "@/utils/math";

export class ThunderHandler extends Turret {

    public static readonly MAX_DAMAGE_RADIUS_PERCENTAGE = 0.5

    public getTurret() {
        return Turrets.THUNDER;
    }

    public canAttackYourself(): boolean {
        return true;
    }

    public getExplosionRadius(): number {
        return 1200;
    }

    public getMaxDamageExplosionRadius() {
        return this.getExplosionRadius() * ThunderHandler.MAX_DAMAGE_RADIUS_PERCENTAGE
    }

    public getMaxDamageRadius() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 56.9 * multiplier;
            case 1: return 61.8 * multiplier;
            case 2: return 66.6 * multiplier;
            case 3: return 70.0 * multiplier;
        }
    }

    public getMinDamageRadius() {
        const multiplier = 100;
        switch (this.item.modificationID) {
            case 0: return 113.85 * multiplier;
            case 1: return 123.49 * multiplier;
            case 2: return 133.12 * multiplier;
            case 3: return 140.00 * multiplier;
        }
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getSplashDamage(hitDistance: number, distance: number): number {
        const { min, max } = this.getDamageRange();
        const damage = MathUtils.randomInt(min, min - (max - min))

        if (
            this.getMaxDamageRadius() >= distance &&
            hitDistance <= this.getMaxDamageExplosionRadius()
        ) {
            return damage
        }

        const factor = 1 - (hitDistance - this.getMaxDamageExplosionRadius()) / (this.getExplosionRadius() - this.getMaxDamageExplosionRadius())
        const decrease = Math.min(1, 1 - ((distance - this.getMaxDamageRadius()) / this.getMinDamageRadius()));

        return damage * decrease * factor;
    }

    public getDamage(distance: number, modifiers: IDamageModifiers): number {
        const { min, max } = this.getDamageRange();
        const damage = MathUtils.randomInt(min, max)

        if (this.getMaxDamageRadius() >= distance) {
            return damage
        }

        const decrease = Math.min(1, 1 - ((distance - this.getMaxDamageRadius()) / this.getMinDamageRadius()));
        return damage * decrease;
    }

    // TODO: raycast to detect collision
    public splash(position: Vector3d, ignore: string[] = []): void {
        const players = this.tank.battle.playersManager.getPlayers();

        for (const player of players) {

            if (
                ignore.includes(player.getUsername()) === false &&
                player.tank.isVisible() && (player.tank.isEnemy(this.tank) || player === this.tank.player)
            ) {
                const distance = player.tank.getPosition().distanceTo(position);
                if (distance <= this.getExplosionRadius()) {
                    // TODO: improve saporra aqui vai tomar no cu calculo fudido do caraio

                    const direction = Vector3d.copy(player.tank.getPosition()).add(new Vector3d(0, 200, 0)).subtract(position)
                    const rayHit = new RayHit()

                    const hit = this.tank.battle.map.collisionManager
                        .raycastStatic(position.swap(), direction.swap(), 16, 1, null, rayHit)

                    if (hit === false) {
                        const damage = this.getSplashDamage(distance, player.tank.getPosition().distanceTo(this.tank.getPosition()));
                        if (damage) {
                            this.tank.battle.combatManager.handleAttack(player, this.tank.player, damage, player.tank.incarnation);
                        }
                    }
                }
            }
        }
    }

    public handlePacket(packet: Packet): void {
        if (packet instanceof SendStormVoidShotPacket) {
            const pk = new SetStormVoidShotPacket();
            pk.shooter = this.tank.player.getUsername();
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStormHitPointShotPacket) {
            this.splash(packet.hitPoint);

            const pk = new SetStormHitPointShotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.hitPoint = packet.hitPoint;
            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendStormTargetShotPacket) {
            const attacked = this.attack(packet.target, packet.incarnation);

            if (attacked) {
                this.splash(packet.hitPoint, [packet.target]);
                const pk = new SetStormTargetShotPacket();
                pk.shooter = this.tank.player.getUsername();
                pk.target = packet.target;
                pk.relativeHitPoint = packet.relativeHitPoint;
                this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
            }
        }
    }
}