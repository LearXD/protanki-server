import { Tank } from "../..";
import { IGarageItem, ITurretProperties, ITurretSfx } from "../../../../managers/garage/types";
import { SendRailgunShotPacket } from "../../../../network/packets/send-railgun-shot";
import { SendStartRailgunShotPacket } from "../../../../network/packets/send-start-railgun-shot";
import { SetRailgunShotPacket } from "../../../../network/packets/set-railgun-shot";
import { SetStartRailgunShotPacket } from "../../../../network/packets/set-start-railgun-shot";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Player } from "../../../player";

export class Turret {

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: ITurretProperties,
        public readonly sfx: ITurretSfx,
    ) { }

    public getName() {
        return this.item.id + '_m' + this.item.modificationID;
    }

    public handlePacket(packet: SimplePacket, tank: Tank) {
        /** RAILGUN */
        if (packet instanceof SendStartRailgunShotPacket) {
            const pk = new SetStartRailgunShotPacket();
            pk.shooter = tank.player.getUsername();
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }

        if (packet instanceof SendRailgunShotPacket) {
            const pk = new SetRailgunShotPacket();
            pk.shooter = tank.player.getUsername();
            pk.staticHitPoint = packet.staticHitPoint;
            pk.targets = packet.targets;
            pk.targetHitPoints = packet.targetsHitPoints;
            tank.battle.broadcastPacket(pk, [tank.player.getUsername()]);
        }
    }
}