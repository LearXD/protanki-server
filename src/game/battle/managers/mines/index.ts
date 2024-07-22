import { IMine, SetBattleMinesResourcesPacket } from "../../../../network/packets/set-battle-mines-resources";
import { Player } from "../../../player";

export class BattleMinesManager {

    private mines: IMine[] = [];

    public sendMines(client: Player) {
        const packet = new SetBattleMinesResourcesPacket();
        packet.soundResource = 389057
        packet.int_1 = 1000
        packet.mines = this.mines
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
}