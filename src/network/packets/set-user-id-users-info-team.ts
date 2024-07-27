import { ByteArray } from "../utils/byte-array";
import { ChatModeratorLevel } from "../../states/chat-moderator-level";
import { Team } from "../../states/team";
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

export class SetUserIdUsersInfoTeamPacket extends Packet {

    public userId: string
    public usersInfo: IUser[]
    public team: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_ID_USERS_INFO_TEAM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.userId = bytes.readString();
        const usersInfoLength = bytes.readInt();
        this.usersInfo = new Array(usersInfoLength);

        for (let i = 0; i < usersInfoLength; i++) {
            this.usersInfo[i] = {
                chatModeratorLevel: ChatModeratorLevel.LEVELS[bytes.readInt()],
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                rank: bytes.readByte(),
                score: bytes.readInt(),
                name: bytes.readString()
            }
        }

        this.team = Team.TEAMS[bytes.readInt()];

        return {
            userId: this.userId,
            usersInfo: this.usersInfo,
            team: this.team
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.userId);

        bytes.writeInt(this.usersInfo.length);
        this.usersInfo.forEach((user: IUser) => {
            bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(user.chatModeratorLevel))
            bytes.writeInt(user.deaths);
            bytes.writeInt(user.kills);
            bytes.writeByte(user.rank);
            bytes.writeInt(user.score);
            bytes.writeString(user.name);
        });

        bytes.writeInt(Team.TEAMS.indexOf(this.team));

        return bytes;
    }
}