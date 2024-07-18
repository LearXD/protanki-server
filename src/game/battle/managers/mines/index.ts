import { IMine, SetBattleMineCCPacket } from "../../../../network/packets/set-battle-mine-cc";
import { Player } from "../../../player";

export class BattleMinesManager {

    private mines: IMine[] = [];

    public sendMinesData(client: Player) {
        const setBattleMineCCPacket = new SetBattleMineCCPacket();
        setBattleMineCCPacket.soundResource = 389057
        setBattleMineCCPacket.int_1 = 1000
        setBattleMineCCPacket.mines = this.mines
        setBattleMineCCPacket.imageResource = 925137
        setBattleMineCCPacket.soundResource2 = 965887
        setBattleMineCCPacket.imageResource2 = 975465
        setBattleMineCCPacket.explosionMarkTexture = 962237
        setBattleMineCCPacket.explosionSound = 175648
        setBattleMineCCPacket.float_1 = 10
        setBattleMineCCPacket.imageResource3 = 523632
        setBattleMineCCPacket.frameResource = 545261
        setBattleMineCCPacket.impactForce = 3
        setBattleMineCCPacket.frameResource2 = 965737
        setBattleMineCCPacket.float_2 = 5
        setBattleMineCCPacket.model3dResource = 895671
        setBattleMineCCPacket.float_3 = 7
        setBattleMineCCPacket.radius = 0.5
        setBattleMineCCPacket.imageResource4 = 342637
        client.sendPacket(setBattleMineCCPacket);
    }
}