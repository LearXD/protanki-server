import { SetBattleUsersEffectsPacket } from "../../../../network/packets/set-battle-users-effects";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Client } from "../../../client";

export class BattleEffectsManager {
    public sendBattleEffects(client: Client) {
        const setBattleUsersEffectsPacket = new SetBattleUsersEffectsPacket(new ByteArray())
        setBattleUsersEffectsPacket.effects = []
        client.sendPacket(setBattleUsersEffectsPacket)
    }
}