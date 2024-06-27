import { IUser } from "../../../../network/packets/set-chat-messages";
import { ChatModeratorLevel, ChatModeratorLevelType } from "../../../../utils/game/chat-moderator-level";
import { Client } from "../../../client";

export class User {

    constructor(
        private moderatorLevel: ChatModeratorLevelType,
        private ip: string,
        private rank: number,
        private username: string,
        private a?: string
    ) {

    }

    static fromClient(client: Client) {
        return new User(
            ChatModeratorLevel.COMMUNITY_MANAGER,
            ' ',
            30,
            client.getUsername(),
            ''
        )
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

    public getA() {
        return this.a;
    }

    public toObject(): IUser {
        return {
            chatModeratorLevel: this.moderatorLevel,
            ip: this.ip,
            rankIndex: this.rank,
            userId: this.username,
            a: this.a
        }
    }
}