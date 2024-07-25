import { TurretHandler } from "..";
import { SendMoveShaftVerticalAxisPacket } from "../../../../../network/packets/send-move-shaft-vertical-axis";
import { SendOpenShaftAimPacket } from "../../../../../network/packets/send-open-shaft-aim";
import { SendShaftAimShotPacket } from "../../../../../network/packets/send-shaft-aim-shot";
import { SendShaftLocalSpotPacket } from "../../../../../network/packets/send-shaft-local-spot";
import { SendShaftShotPacket } from "../../../../../network/packets/send-shaft-shot";
import { SendShaftStopAimPacket } from "../../../../../network/packets/send-shaft-stop-aim";
import { SendStartShaftAimPacket } from "../../../../../network/packets/send-start-shaft-aim";
import { SetMoveShaftVerticalAxisPacket } from "../../../../../network/packets/set-move-shaft-vertical-axis";
import { SetShaftLocalSpotPacket } from "../../../../../network/packets/set-shaft-local-spot";
import { SetShaftShotPacket } from "../../../../../network/packets/set-shaft-shot";
import { SetStartShaftShotPacket } from "../../../../../network/packets/set-start-shaft-shot";
import { SetStopShaftShotPacket } from "../../../../../network/packets/set-stop-shaft-shot";
import { SimplePacket } from "../../../../../network/packets/simple-packet";
import { Player } from "../../../../player";

export class ShaftHandler extends TurretHandler {

    public getDamage(): number {
        throw new Error("Method not implemented.");
    }

    public handleDamage(target: Player): void {

    }

    public handlePacket(packet: SimplePacket): void {
        if (packet instanceof SendStartShaftAimPacket) {
            const pk = new SetStartShaftShotPacket();
            pk.shooter = this.tank.player.getUsername();

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendOpenShaftAimPacket) {

        }

        if (packet instanceof SendShaftStopAimPacket) {
            const pk = new SetStopShaftShotPacket();
            pk.shooter = this.tank.player.getUsername();

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftShotPacket) {
            const pk = new SetShaftShotPacket();

            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = 10;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftAimShotPacket) {
            const pk = new SetShaftShotPacket();

            pk.shooter = this.tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            pk.impactForce = 10;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendMoveShaftVerticalAxisPacket) {
            const pk = new SetMoveShaftVerticalAxisPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.projectionOnVerticalAxis = packet.projectionOnVerticalAxis;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }

        if (packet instanceof SendShaftLocalSpotPacket) {
            const pk = new SetShaftLocalSpotPacket();
            pk.shooter = this.tank.player.getUsername();
            pk.target = packet.tank;
            pk.position = packet.localSpotPosition;

            this.tank.battle.broadcastPacket(pk, [this.tank.player.getUsername()]);
        }
    }
}