import { Message } from "../../game/chat/utils/message";
import { User } from "../../game/chat/utils/user";
import { Player } from "../../game/player";
import { SetChatMessagesPacket } from "../../network/packets/set-chat-messages";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class ChatManager {

    private messages: Message[] = []

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
        const packet = new SetChatMessagesPacket(new ByteArray());
        packet.messages = [message.toObject()];
        this.server.getClientHandler().broadcast(packet);
    }

    public sendMessage(player: Player, text: string, target?: string) {
        return this.addMessage(
            new Message(
                text,
                player.getChatManager().getChatUser(),
                target ? new User(target, 1).toObject() : null
            )
        );
    }

    public sendServerMessage(text: string, warning: boolean = false) {
        return this.addMessage(new Message(text, null, null, true, warning))
    }

}