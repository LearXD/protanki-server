import { SetAddTankEffectPacket } from "@/network/packets/set-add-tank-effect";
import { SetBattleUsersEffectsPacket } from "../../../../network/packets/set-battle-users-effects";
import { Player } from "../../../player";
import { Battle } from "../..";
import { SetRemoveTankEffectPacket } from "@/network/packets/set-remove-tank-effect";
import { Supply, SupplyType } from "@/states/supply";

export class BattleEffectsManager {

    public constructor(
        private readonly battle: Battle
    ) { }

    public sendBattleEffects(client: Player) {
        const setBattleUsersEffectsPacket = new SetBattleUsersEffectsPacket()

        setBattleUsersEffectsPacket.effects = this.battle.playersManager.getPlayers()
            .map(player => player.tank.getEffects()).flat()

        client.sendPacket(setBattleUsersEffectsPacket)
    }

    public broadcastAddBattleEffect(
        player: Player,
        effectId: SupplyType,
        duration: number,
        effectLevel: number = 1,
        activeAfterDeath: boolean = false,
    ) {
        const packet = new SetAddTankEffectPacket()
        packet.tankId = player.getUsername()
        packet.effectId = Supply.ALL.indexOf(effectId) + 1
        packet.duration = duration
        packet.activeAfterDeath = activeAfterDeath
        packet.effectLevel = effectLevel
        this.battle.broadcastPacket(packet)
    }

    public broadcastRemoveBattleEffect(player: Player, effectId: SupplyType) {
        const packet = new SetRemoveTankEffectPacket();
        packet.tankId = player.getUsername();
        packet.effectId = Supply.ALL.indexOf(effectId) + 1;
        this.battle.broadcastPacket(packet);
    }

}