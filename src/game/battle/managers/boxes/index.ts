import { SetBattleSpawnedBoxesPacket } from "../../../../network/packets/set-battle-spawned-boxes";
import { SetBonusesDataPacket } from "../../../../network/packets/set-bonuses-data";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Client } from "../../../client";

export class BattleBoxesManager {

    public sendBoxesData(client: Client) {
        const bonuses = client.getServer().getBattlesManager().getData('bonuses.json')
        const setBonusesDataPacket = new SetBonusesDataPacket(new ByteArray());
        setBonusesDataPacket.data = bonuses;
        client.sendPacket(setBonusesDataPacket);
    }

    public sendSpawnedBoxes(client: Client) {
        const setBattleSpawnedBoxesPacket = new SetBattleSpawnedBoxesPacket(new ByteArray())
        setBattleSpawnedBoxesPacket.boxes = []
        client.sendPacket(setBattleSpawnedBoxesPacket)
    }
}