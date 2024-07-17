import { Message } from "../../game/chat/utils/message";
import { User } from "../../game/chat/utils/user";
import { Player } from "../../game/player";
import { SetChatCostPacket } from "../../network/packets/set-chat-cost";
import { SetChatInitParamsPacket } from "../../network/packets/set-chat-init-params";
import { SetChatMessagesPacket } from "../../network/packets/set-chat-messages";
import { SetRemoveChatPacket } from "../../network/packets/set-remove-chat";
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

    public getUserChatConfig(client: Player) {
        return {
            admin: false,
            antiFloodEnabled: true,
            bufferSize: 60,
            chatEnabled: true,
            chatModeratorLevel: 'NONE',
            linksWhiteList: ['http://gtanks-online.com/', 'http://vk.com/ebal'],
            minChar: 60,
            minWord: 5,
            selfName: client.getUsername(),
            showLinks: true,
            typingSpeedAntifloodEnabled: true
        }
    }

    public broadcastMessage(message: Message) {
        const packet = new SetChatMessagesPacket(new ByteArray());
        packet.messages = [message.toObject()];
        this.server.getClientHandler().broadcast(packet);
    }

    public sendChat(player: Player) {
        this.sendChatConfig(player);
        this.sendChatMessages(player);
    }

    public sendChatMessages(client: Player) {
        const setChatMessagesPacket = new SetChatMessagesPacket(new ByteArray());
        setChatMessagesPacket.messages = this.messages.map(message => message.toObject());
        client.sendPacket(setChatMessagesPacket);
    }

    public sendChatConfig(client: Player) {
        const data = this.getUserChatConfig(client);

        const setChatInitParamsPacket = new SetChatInitParamsPacket(new ByteArray());

        setChatInitParamsPacket.admin = data.admin;
        setChatInitParamsPacket.antiFloodEnabled = data.antiFloodEnabled;
        setChatInitParamsPacket.bufferSize = data.bufferSize;
        setChatInitParamsPacket.chatEnabled = data.chatEnabled;
        setChatInitParamsPacket.chatModeratorLevel = data.chatModeratorLevel;
        setChatInitParamsPacket.linksWhiteList = data.linksWhiteList;
        setChatInitParamsPacket.minChar = data.minChar;
        setChatInitParamsPacket.minWord = data.minWord;
        setChatInitParamsPacket.selfName = data.selfName;
        setChatInitParamsPacket.showLinks = data.showLinks;
        setChatInitParamsPacket.typingSpeedAntifloodEnabled = data.typingSpeedAntifloodEnabled;
        client.sendPacket(setChatInitParamsPacket);

        const setChatCostPacket = new SetChatCostPacket(new ByteArray());
        setChatCostPacket.symbolCost = 176
        setChatCostPacket.enterCost = 880

        client.sendPacket(setChatCostPacket);
    }

    public sendRemoveChatScreen(client: Player) {
        const packet = new SetRemoveChatPacket(new ByteArray());
        client.sendPacket(packet);

    }

    public handleClientSendMessage(client: Player, text: string, target?: string) {
        return this.addMessage(
            new Message(
                text,
                User.fromClient(client),
                target ? User.fromClient(client) : null
            )
        );
    }

    public handleSendServerMessage(text: string, warning: boolean = false) {
        return this.addMessage(new Message(text, null, null, true, warning))
    }

}