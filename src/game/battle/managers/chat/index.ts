import { Battle } from "../..";
import { SetBattleChatEnabledPacket } from "../../../../network/packets/set-battle-chat-enabled";
import { SetBattleMessagePacket } from "../../../../network/packets/set-battle-message";
import { Team, TeamType } from "../../../../states/team";
import { Player } from "../../../player";
import { IBattleMessage } from "./types";


export class BattleChatManager {

    public messages: IBattleMessage[] = [];

    public constructor(
        private readonly battle: Battle
    ) { }

    public sendEnableChat(player: Player) {
        player.sendPacket(new SetBattleChatEnabledPacket());
    }

    public handleSendMessage(player: Player, message: string, isTeam: boolean) {
        const isSpectator = this.battle.getPlayersManager().hasSpectator(player);
        this.broadcastMessage(isSpectator ? null : player.getUsername(), message, isTeam ? Team.BLUE : Team.NONE);
    }

    public broadcastMessage(userId: string, message: string, team: TeamType) {
        this.messages.push({ userId, message, team });

        const packet = new SetBattleMessagePacket();
        packet.userId = userId;
        packet.message = message;
        packet.team = team;

        this.battle.broadcastPacket(packet);
    }
}