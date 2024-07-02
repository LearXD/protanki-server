import { ByteArray } from "../../utils/network/byte-array";
import { ChatModeratorLevel } from "../../utils/game/chat-moderator-level";
import { EquipmentConstraintsMode } from "../../utils/game/equipment-constraints-mode";
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

export class SetBattleStatisticsDMCCPacket extends Packet {

    public users: any[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_STATISTICS_DM_CC, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

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
            users: this.users
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.users.length);

        this.users.forEach((user: IUser) => {
            bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(user.chatModeratorLevel));
            bytes.writeInt(user.deaths);
            bytes.writeInt(user.kills);
            bytes.writeByte(user.rank);
            bytes.writeInt(user.score);
            bytes.writeString(user.name);
        });

        return bytes;
    }
}