import { SetBattleUsersEffectsPacket } from "../../../../network/packets/set-battle-users-effects";
import { Player } from "../../../player";

export class BattleEffectsManager {
    public sendBattleEffects(client: Player) {
        const setBattleUsersEffectsPacket = new SetBattleUsersEffectsPacket()
        setBattleUsersEffectsPacket.effects = []
        client.sendPacket(setBattleUsersEffectsPacket)
    }
}