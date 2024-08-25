import { Message } from "@/server/managers/chat/utils/message";
import { ChatUser } from "@/server/managers/chat/utils/user";
import { Player } from "@/game/player";
import { Server } from "@/server";

export class ChatManager {

    public static readonly BATTLE_INVITE_PREFIX = /#\/battle\/([a-zA-Z0-9]+)/g;
    public readonly messages: Message[] = []

    constructor(
        private readonly server: Server
    ) { }

    public broadcastMessage(message: Message) {
        this.messages.push(message);

        this.server.playersManager.getPlayers().forEach(player => {
            player.chatManager.sendSetMessage(message)
        })

        return message;
    }

    public broadcastServerMessage(text: string, warning: boolean = false) {
        return this.broadcastMessage(new Message(text, null, null, true, warning))
    }

    public handleSendMessage(player: Player, text: string, target: string = null) {

        if (this.server.commandsManager.handleSendCommand(player, text)) {
            return;
        }

        const message = new Message(text, ChatUser.fromData(player.data));
        if (target) {
            const data = this.server.userDataManager.findPlayerData(target);
            if (!data) {
                player.chatManager.sendMessage(`Usuário ${target} não encontrado`, true)
                return;
            }
            message.target = new ChatUser(data.username, data.getRank(), data.moderatorLevel);
        }

        message.text = message.text.replace(
            ChatManager.BATTLE_INVITE_PREFIX,
            (match, battleId) => {
                if (battleId.length === 0x10) {
                    const battle = this.server.battleManager.getBattleById(battleId);
                    if (battle) {
                        return `#battle|${battle.name}|${battleId}`;
                    }
                }
                return match;
            }
        )

        this.broadcastMessage(message);
    }
}