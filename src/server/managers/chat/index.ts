import { Message } from "@/game/chat/utils/message";
import { User } from "@/game/chat/utils/user";
import { Player } from "@/game/player";
import { Server } from "@/server";

export class ChatManager {

    public messages: Message[] = []

    constructor(
        private readonly server: Server
    ) { }

    public addMessage(message: Message) {
        this.messages.push(message);
        this.broadcastMessage(message);
        return message;
    }

    public getMessages() {
        return this.messages;
    }

    public clearMessages() {
        this.messages = [];
    }

    public broadcastMessage(message: Message) {
        this.server.playersManager.getPlayers().forEach(player => {
            player.chatManager.sendSetMessage(message)
        })
    }

    public handleSendMessage(player: Player, text: string, target: string = null) {

        if (this.server.commandsManager.handleSendCommand(player, text)) {
            return;
        }

        const message = new Message(text, player.chatManager.getChatUser())

        if (target) {
            const data = this.server.userDataManager.findPlayerData(target);

            if (!data) {
                return player.chatManager.sendMessage(`Usuário ${target} não encontrado`, true)
            }

            message.setTarget(User.fromData(data).toObject())
        }

        return this.addMessage(message);
    }

    public sendServerMessage(text: string, warning: boolean = false) {
        return this.addMessage(new Message(text, null, null, true, warning))
    }

}