import { SetBattleSpawnedBoxesPacket } from "../../../../network/packets/set-battle-spawned-boxes";
import { SetBonusesDataPacket } from "../../../../network/packets/set-bonuses-data";
import { Player } from "../../../player";

export class BattleBoxesManager {

    public sendData(client: Player) {
        this.sendBoxesData(client)
        this.sendSpawnedBoxes(client)
    }

    public sendBoxesData(client: Player) {
        const bonuses = client.getServer().getBattlesManager().getData('bonuses.json')
        const setBonusesDataPacket = new SetBonusesDataPacket();
        setBonusesDataPacket.data = bonuses;
        client.sendPacket(setBonusesDataPacket);
    }

    public sendSpawnedBoxes(client: Player) {
        const setBattleSpawnedBoxesPacket = new SetBattleSpawnedBoxesPacket()
        setBattleSpawnedBoxesPacket.boxes = []
        client.sendPacket(setBattleSpawnedBoxesPacket)
    }
}