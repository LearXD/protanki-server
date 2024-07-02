import { Player } from "../..";
import { SendChatMessagePacket } from "../../../../network/packets/send-chat-message";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Message } from "../../../chat/utils/message";

export class PlayerChatManager {

    private messages: Message[] = []

    constructor(
        private readonly player: Player
    ) { }

    public getMessagesSent() {
        return this.messages;
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendChatMessagePacket) {
            const message = this.player.getServer().getChatManager()
                .handleClientSendMessage(this.player, packet.text, packet.target);

            if (message) {
                this.messages.push(message);
            }
            return true
        }
        return false;
    }
}