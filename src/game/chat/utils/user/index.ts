import { IUser } from "../../../../network/packets/set-chat-messages";
import { ChatModeratorLevel, ChatModeratorLevelType } from "../../../../utils/game/chat-moderator-level";
import { Rank } from "../../../../utils/game/rank";
import { Player } from "../../../player";
import { PlayerData } from "../../../player/utils/data";

export class User {

    constructor(
        private username: string,
        private rank: number,
        private moderatorLevel: ChatModeratorLevelType = ChatModeratorLevel.NONE,
        private ip: string = '',
    ) { }

    static fromData(data: PlayerData) {
        return new User(data.getUsername(), data.getRank(), data.getModeratorLevel())
    }

    static fromClient(client: Player) {
        return new User(client.getUsername(), Rank.GENERALISSIMO, ChatModeratorLevel.COMMUNITY_MANAGER)
    }

    public getModeratorLevel() {
        return this.moderatorLevel;
    }

    public getIp() {
        return this.ip;
    }

    public getRank() {
        return this.rank;
    }

    public getUsername() {
        return this.username;
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