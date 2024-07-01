import { SetBattleMineCCPacket } from "../../../../network/packets/set-battle-mine-cc";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Client } from "../../../client";

export class BattleMinesManager {
    public sendMinesData(client: Client) {
        const setBattleMineCCPacket = new SetBattleMineCCPacket(new ByteArray());
        setBattleMineCCPacket.soundResource = 389057
        setBattleMineCCPacket.int_1 = 1000
        setBattleMineCCPacket.mines = []
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