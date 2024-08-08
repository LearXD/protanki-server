import { IUser } from "../../../../../network/packets/set-chat-messages";
import { ChatModeratorLevel, ChatModeratorLevelType } from "../../../../../states/chat-moderator-level";
import { PlayerData } from "../../../../../game/player/utils/data";

export class ChatUser {

    constructor(
        public username: string,
        public rank: number,
        public moderatorLevel: ChatModeratorLevelType = ChatModeratorLevel.NONE,
        public ip: string = '',
    ) { }

    static fromData(data: PlayerData) {
        return new ChatUser(data.username, data.getRank(), data.moderatorLevel)
    }

    public toObject(): IUser {
        return {
            chatModeratorLevel: this.moderatorLevel,
            ip: this.ip,
            rankIndex: this.rank,
            userId: this.username,
        }
    }
}