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

export class ThunderHandler extends Turret {

    public getTurret() {
        return Turrets.THUNDER;
    }

    public getExplosionRadius(): number {
        return 1200;
    }

    public getDamageRadius() {
        const range = this.getSubProperty("SHOT_RANGE", "WEAPON_MIN_DAMAGE_RADIUS")
        return {
            min: range ? parseInt(range.value) * 100 : 0,
            max: range ? parseInt(range.value) * 2 * 100 : 0,
        };
    }

    public getDamageRange() {
        const min = this.getSubProperty("DAMAGE", "DAMAGE_FROM")
        const max = this.getSubProperty("DAMAGE", "DAMAGE_TO")

        return {
            min: min ? parseInt(min.value) : 0,
            max: max ? parseInt(max.value) : 0
        }
    }

    public getDamage(modifiers: IDamageModifiers): number {
        Logger.debug(`Distance: ${modifiers.distance} `);
        if (modifiers.splash) {

            if (modifiers.distance >= this.getExplosionRadius()) {
                return 0;
            }

        }

        const radius = this.getDamageRadius();
        const range = this.getDamageRange();

        if (modifiers.distance <= radius.min) {
            return range.max;
        }

        if (modifiers.distance >= radius.max) {
            return range.min;
        }

        const percentage = (modifiers.distance - radius.min) / (radius.max - radius.min);
        const damage = range.max - (range.max - range.min) * percentage;

        return damage;
    }

    public canAttackYourself(): boolean {
        return true;
    }

    // TODO: raycast to detect collision
    public splash(position: Vector3d, ignore: string[] = []): void {
        const battle = this.tank.battle;
        const players = battle.playersManager.getPlayers();

        for (const player of players) {

            if (ignore.includes(player.getUsername())) {
                continue;
            }

            const modifiers: IDamageModifiers = {
                distance: player.tank.getPosition().distanceTo(position),
                incarnation: player.tank.incarnation,
            }

            if (modifiers.distance >= this.getExplosionRadius()) {
                continue;
            }

            // TODO: improve saporra aqui vai tomar no cu calculo fudido do caraio
            const direction = Vector3d.copy(player.tank.getPosition())
            direction.add(new Vector3d(0, 200, 0))
            direction.subtract(position)

            const rayHit = new RayHit()
            const hit = this.tank.battle.getMap().collisionManager
                .raycastStatic(position.swap(), direction.swap(), 16, 1, null, rayHit)

            if (!hit) {
                this.attack(player, modifiers);
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
            const attacked = this.attack(packet.target, { incarnation: packet.incarnation });

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