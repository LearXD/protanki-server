import { SetPlaceMinePacket } from "@/network/packets/set-place-mine";
import { SetBattleMinesResourcesPacket } from "../../../../network/packets/set-battle-mines-resources";
import { Player } from "../../../player";
import { Battle } from "../..";
import { Mine } from "../../objects/mine";
import { SetMinePlacedPacket } from "@/network/packets/set-mine-placed";
import { TimeType } from "../task/types";
import { SetExplodeMinePacket } from "@/network/packets/set-explode-mine";
import { MathUtils } from "@/utils/math";
import { SetRemoveUserMinesPacket } from "@/network/packets/set-remove-user-mines";

export class BattleMinesManager {

    public constructor(
        private readonly battle: Battle
    ) { }

    private mines: Mine[] = [];

    public placeMine(player: Player) {
        const mine = new Mine(player, this.mines.length, player.tank.getPosition());

        this.battle.collisionManager.addObject(mine);
        this.mines.push(mine);

        this.sendPlaceMine(mine);
        this.battle.taskManager.scheduleTask(() => {
            this.sendMinePlaced(mine.owner, mine);
        }, 1 * TimeType.SECONDS, mine.owner.getUsername());
    }

    public removePlayerMines(player: Player) {

        this.mines.forEach(mine => {
            if (mine.owner.getUsername() === player.getUsername() && mine.active) {
                mine.active = false;
                this.battle.collisionManager.removeObject(mine.name);
            }
        });

        const packet = new SetRemoveUserMinesPacket();
        packet.ownerId = player.getUsername();
        this.battle.broadcastPacket(packet);
    }

    public sendMineExplosion(mine: Mine, target: Player) {
        const packet = new SetExplodeMinePacket();
        packet.mineId = mine.id.toString();
        packet.targetId = target.getUsername();
        this.battle.broadcastPacket(packet);
    }

    public sendPlaceMine(mine: Mine) {
        const packet = new SetPlaceMinePacket();

        packet.mineId = mine.id.toString();
        packet.x = mine.position.x;
        packet.y = mine.position.z;
        packet.z = mine.position.y;
        packet.userId = mine.owner.getUsername();

        this.battle.broadcastPacket(packet);
    }

    public sendMinePlaced(player: Player, mine: Mine) {
        const packet = new SetMinePlacedPacket();
        packet.mineId = mine.id.toString();
        this.battle.broadcastPacket(packet);
    }

    public getPlayerMines(player: Player) {
        return this.mines.filter(mine => mine.owner.getUsername() === player.getUsername());
    }

    public sendMines(client: Player) {
        const packet = new SetBattleMinesResourcesPacket();
        packet.soundResource = 389057
        packet.int_1 = 1000
        packet.mines = this.mines
            .filter(mine => mine.active)
            .map(mine => ({
                activated: mine.active,
                mineId: mine.id.toString(),
                ownerId: mine.owner.getUsername(),
                position: mine.position
            }))
        packet.imageResource = 925137
        packet.soundResource2 = 965887
        packet.imageResource2 = 975465
        packet.explosionMarkTexture = 962237
        packet.explosionSound = 175648
        packet.float_1 = 10
        packet.imageResource3 = 523632
        packet.frameResource = 545261
        packet.impactForce = 3
        packet.frameResource2 = 965737
        packet.float_2 = 5
        packet.model3dResource = 895671
        packet.float_3 = 7
        packet.radius = 0.5
        packet.imageResource4 = 342637
        client.sendPacket(packet);
    }

    public handleMineExplosion(mine: Mine, target: Player) {
        mine.active = false;
        target.tank.damage(MathUtils.randomInt(120, 240), mine.owner);
        this.sendMineExplosion(mine, target);
    }
}