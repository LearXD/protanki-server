import { SetBattleUsersEffectsPacket } from "../../../../network/packets/set-battle-users-effects";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Player } from "../../../player";

export class BattleEffectsManager {
    public sendBattleEffects(client: Player) {
        const setBattleUsersEffectsPacket = new SetBattleUsersEffectsPacket(new ByteArray())
        setBattleUsersEffectsPacket.effects = []
        client.sendPacket(setBattleUsersEffectsPacket)
    }
}