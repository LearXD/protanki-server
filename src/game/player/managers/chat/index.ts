import { Packet } from "@/network/packets/packet";
import { Player } from "../..";
import { SendChatMessagePacket } from "../../../../network/packets/send-chat-message";
import { SetChatCostPacket } from "../../../../network/packets/set-chat-cost";
import { SetChatInitParamsPacket } from "../../../../network/packets/set-chat-init-params";
import { SetChatMessagesPacket } from "../../../../network/packets/set-chat-messages";
import { SetRemoveChatPacket } from "../../../../network/packets/set-remove-chat";
import { Message } from "../../../../server/managers/chat/utils/message";

export class PlayerChatManager {

    constructor(
        private readonly player: Player
    ) { }

    public sendChat() {
        this.sendChatConfig();
        this.sendChatMessages();
    }

    public sendRemoveChatScreen() {
        const packet = new SetRemoveChatPacket();
        this.player.sendPacket(packet);
    }

    public sendMessage(text: string, warning: boolean = false) {
        this.sendSetMessage(new Message(text, null, null, true, warning))
    }

    public sendSetMessage(message: Message) {
        const packet = new SetChatMessagesPacket();
        packet.messages = [message.toObject()];
        this.player.sendPacket(packet);
    }

    public sendChatMessages() {
        const setChatMessagesPacket = new SetChatMessagesPacket();

        setChatMessagesPacket.messages = this.player.server.chat.messages
            .map(message => message.toObject());

        this.player.sendPacket(setChatMessagesPacket);
    }

    public sendChatConfig() {
        const setChatInitParamsPacket = new SetChatInitParamsPacket();

        setChatInitParamsPacket.admin = this.player.data.isAdmin();
        setChatInitParamsPacket.antiFloodEnabled = !this.player.data.isAdmin();
        setChatInitParamsPacket.bufferSize = 60;
        setChatInitParamsPacket.chatEnabled = true;
        setChatInitParamsPacket.chatModeratorLevel = this.player.data.moderatorLevel;
        setChatInitParamsPacket.linksWhiteList = [];
        setChatInitParamsPacket.minChar = 60;
        setChatInitParamsPacket.minWord = 5;
        setChatInitParamsPacket.selfName = this.player.getName();
        setChatInitParamsPacket.showLinks = this.player.data.isAdmin();
        setChatInitParamsPacket.typingSpeedAntifloodEnabled = !this.player.data.isAdmin()
        this.player.sendPacket(setChatInitParamsPacket);

        const setChatCostPacket = new SetChatCostPacket();
        setChatCostPacket.symbolCost = 176
        setChatCostPacket.enterCost = 880
        this.player.sendPacket(setChatCostPacket);
    }

    public handlePacket(packet: Packet) {
        if (packet instanceof SendChatMessagePacket) {
            this.player.server.chat.handleSendMessage(this.player, packet.text, packet.target);
        }
    }
}