import { SetBattleSystemMessagePacket } from "@/network/packets/set-battle-system-message";
import { Battle } from "../..";
import { SetBattleChatEnabledPacket } from "../../../../network/packets/set-battle-chat-enabled";
import { SetBattleMessagePacket } from "../../../../network/packets/set-battle-message";
import { Team, TeamType } from "../../../../states/team";
import { Player } from "../../../player";
import { IBattleMessage } from "./types";
import { BattleMode } from "@/states/battle-mode";
import { SetBattleTeamMessagePacket } from "@/network/packets/set-battle-team-message";

export class BattleChatManager {

    public messages: IBattleMessage[] = [];

    public constructor(
        private readonly battle: Battle
    ) { }

    public sendEnableChat(player: Player) {
        player.sendPacket(new SetBattleChatEnabledPacket());
    }

    public broadcastSystemMessage(message: string) {
        const packet = new SetBattleSystemMessagePacket();
        packet.message = message;
        this.battle.broadcastPacket(packet);
    }

    public broadcastMessage(userId: string, message: string, team: TeamType, isPrivate: boolean) {
        this.messages.push({ userId, message, team, isPrivate });

        if (isPrivate) {
            const packet = new SetBattleTeamMessagePacket();
            packet.userId = userId;
            packet.message = message;
            packet.team = team;
            this.battle.broadcastPacketToTeam(packet, team);
            return;
        }

        const packet = new SetBattleMessagePacket();
        packet.userId = userId;
        packet.message = message;
        packet.team = team;
        this.battle.broadcastPacket(packet);
    }

    public sendMessage(player: Player, message: string) {
        const packet = new SetBattleSystemMessagePacket();
        packet.message = message;
        player.sendPacket(packet);
    }

    public handleSendMessage(player: Player, message: string, isPrivate: boolean) {

        if (player.getServer().getCommandsManager().handleSendCommand(player, message)) {
            return;
        }

        const isSpectator = this.battle.getPlayersManager().hasSpectator(player);
        const sender = isSpectator ? null : player.getUsername();

        if (this.battle.getMode() === BattleMode.DM) {
            this.broadcastMessage(sender, message, Team.NONE, false);
            return;
        }

        this.broadcastMessage(sender, message, isSpectator ? null : player.getTank().getTeam(), isPrivate);
    }
}