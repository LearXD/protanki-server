import { Player } from "../..";
import { SendChatMessagePacket } from "../../../../network/packets/send-chat-message";
import { SetChatCostPacket } from "../../../../network/packets/set-chat-cost";
import { SetChatInitParamsPacket } from "../../../../network/packets/set-chat-init-params";
import { IUser, SetChatMessagesPacket } from "../../../../network/packets/set-chat-messages";
import { SetRemoveChatPacket } from "../../../../network/packets/set-remove-chat";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class PlayerChatManager {

    constructor(
        private readonly player: Player
    ) { }

    public getChatUser(): IUser {
        return {
            chatModeratorLevel: this.player.getDataManager().getModeratorLevel(),
            ip: '',
            rankIndex: this.player.getDataManager().getRank(),
            userId: this.player.getUsername()
        }
    }

    public sendChat() {
        this.sendChatConfig();
        this.sendChatMessages();
    }

    public sendRemoveChatScreen() {
        const packet = new SetRemoveChatPacket();
        this.player.sendPacket(packet);
    }

    public sendChatMessages() {
        const setChatMessagesPacket = new SetChatMessagesPacket();
        setChatMessagesPacket.messages = this.player.getServer().getChatManager().getMessages()
            .map(message => message.toObject());

        this.player.sendPacket(setChatMessagesPacket);
    }

    public sendChatConfig() {
        const setChatInitParamsPacket = new SetChatInitParamsPacket();

        setChatInitParamsPacket.admin = this.player.getDataManager().isAdmin();
        setChatInitParamsPacket.antiFloodEnabled = !this.player.getDataManager().isAdmin();
        setChatInitParamsPacket.bufferSize = 60;
        setChatInitParamsPacket.chatEnabled = true;
        setChatInitParamsPacket.chatModeratorLevel = this.player.getDataManager().getModeratorLevel();
        setChatInitParamsPacket.linksWhiteList = [];
        setChatInitParamsPacket.minChar = 60;
        setChatInitParamsPacket.minWord = 5;
        setChatInitParamsPacket.selfName = this.player.getUsername();
        setChatInitParamsPacket.showLinks = this.player.getDataManager().isAdmin();
        setChatInitParamsPacket.typingSpeedAntifloodEnabled = !this.player.getDataManager().isAdmin()
        this.player.sendPacket(setChatInitParamsPacket);

        const setChatCostPacket = new SetChatCostPacket();
        setChatCostPacket.symbolCost = 176
        setChatCostPacket.enterCost = 880
        this.player.sendPacket(setChatCostPacket);
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendChatMessagePacket) {
            this.player.getServer().getChatManager().sendMessage(this.player, packet.text, packet.target);
            return true
        }
        return false;
    }
}