import { ByteArray } from "../utils/byte-array";
import { ChatModeratorLevel } from "../../states/chat-moderator-level";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IUser {
    chatModeratorLevel: string;
    deaths: number;
    kills: number;
    rank: number;
    score: number;
    name: string;
}

export class SetBattleAddUsersPropertiesPacket extends Packet {

    public userId: string;
    public users: IUser[];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_ADD_USERS_PROPERTIES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();

        const length = bytes.readInt();
        this.users = new Array(length);

        for (let i = 0; i < length; i++) {
            this.users[i] = {
                chatModeratorLevel: ChatModeratorLevel.LEVELS[bytes.readInt()],
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                rank: bytes.readByte(),
                score: bytes.readInt(),
                name: bytes.readString()
            }
        }

        return {
            userId: this.userId,
            users: this.users
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.userId);
        bytes.writeInt(this.users.length);

        this.users.forEach((user: IUser) => {
            bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(user.chatModeratorLevel))
            bytes.writeInt(user.deaths);
            bytes.writeInt(user.kills);
            bytes.writeByte(user.rank);
            bytes.writeInt(user.score);
            bytes.writeString(user.name);
        });

        return bytes;
    }
}