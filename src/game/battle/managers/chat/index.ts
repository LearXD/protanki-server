import { Battle } from "../..";
import { SetBattleChatEnabledPacket } from "../../../../network/packets/set-battle-chat-enabled";
import { Player } from "../../../player";

export class BattleChatManager {
    public constructor(
        private readonly battle: Battle
    ) { }

    public sendEnableChat(player: Player) {
        player.sendPacket(new SetBattleChatEnabledPacket());
    }
}