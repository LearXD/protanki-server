import { ByteArray } from "../../utils/network/byte-array";
import { ChatModeratorLevel } from "../../utils/game/chat-moderator-level";
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

export class SetBattleStatisticsTeamCCPacket extends Packet {

    public bluePoints: number
    public redPoints: number
    public blueUsers: IUser[]
    public redUsers: IUser[]

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_STATISTICS_TEAM_CC, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.bluePoints = bytes.readInt();
        this.redPoints = bytes.readInt();

        const length_1 = bytes.readInt();
        this.blueUsers = new Array(length_1);

        for (let i = 0; i < length_1; i++) {
            this.blueUsers[i] = {
                chatModeratorLevel: ChatModeratorLevel.LEVELS[bytes.readInt()],
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                rank: bytes.readByte(),
                score: bytes.readInt(),
                name: bytes.readString()
            }
        }

        const length_2 = bytes.readInt();
        this.redUsers = new Array(length_2);

        for (let i = 0; i < length_2; i++) {
            this.redUsers[i] = {
                chatModeratorLevel: ChatModeratorLevel.LEVELS[bytes.readInt()],
                deaths: bytes.readInt(),
                kills: bytes.readInt(),
                rank: bytes.readByte(),
                score: bytes.readInt(),
                name: bytes.readString()
            }
        }

        return {
            bluePoints: this.bluePoints,
            redPoints: this.redPoints,
            blueUsers: this.blueUsers,
            redUsers: this.redUsers
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.bluePoints);
        bytes.writeInt(this.redPoints);

        bytes.writeShort(this.blueUsers.length);

        this.blueUsers.forEach((user: IUser) => {
            bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(user.chatModeratorLevel))
            bytes.writeInt(user.deaths);
            bytes.writeInt(user.kills);
            bytes.writeByte(user.rank);
            bytes.writeInt(user.score);
            bytes.writeString(user.name);
        });

        bytes.writeShort(this.redUsers.length);

        this.redUsers.forEach((user: IUser) => {
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