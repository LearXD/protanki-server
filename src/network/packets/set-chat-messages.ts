import { ByteArray } from "../../utils/network/byte-array";
import { ChatModeratorLevel } from "../../utils/game/chat-moderator-level";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IMessage {
    sourceUserStatus: IUser,
    system: boolean,
    targetUserStatus: IUser,
    text: string,
    warning: boolean,
}

export interface IUser {
    chatModeratorLevel: string,
    ip: string,
    rankIndex: number,
    userId: string
}

export class SetChatMessagesPacket extends Packet {

    public messages: IMessage[] = [];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CHAT_MESSAGES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.messages = new Array(length);

        for (let i = 0; i < length; i++) {

            const sourceUser = bytes.readBoolean() ? null :
                {
                    chatModeratorLevel: ChatModeratorLevel.LEVELS[bytes.readInt()],
                    ip: bytes.readString(),
                    rankIndex: bytes.readInt(),
                    userId: bytes.readString(),
                }

            const system = bytes.readBoolean();

            const targetUser = bytes.readBoolean() ? null : {
                chatModeratorLevel: ChatModeratorLevel.LEVELS[bytes.readInt()],
                ip: bytes.readString(),
                rankIndex: bytes.readInt(),
                userId: bytes.readString()
            }

            const text = bytes.readString();
            const warning = bytes.readBoolean();

            this.messages[i] = {
                sourceUserStatus: sourceUser,
                system,
                targetUserStatus: targetUser,
                text,
                warning,
            }
        }

        return {
            messages: this.messages
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.messages.length);

        this.messages.forEach(message => {
            if (message.sourceUserStatus === null) {
                bytes.writeBoolean(true);
            } else {
                bytes.writeBoolean(false);
                bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(message.sourceUserStatus.chatModeratorLevel));
                bytes.writeString(message.sourceUserStatus.ip);
                bytes.writeInt(message.sourceUserStatus.rankIndex);
                bytes.writeString(message.sourceUserStatus.userId);
            }

            bytes.writeBoolean(message.system);

            if (message.targetUserStatus === null) {
                bytes.writeBoolean(true);
            } else {
                bytes.writeBoolean(false);
                bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(message.targetUserStatus.chatModeratorLevel));
                bytes.writeString(message.targetUserStatus.ip);
                bytes.writeInt(message.targetUserStatus.rankIndex);
                bytes.writeString(message.targetUserStatus.userId);
            }

            bytes.writeString(message.text);
            bytes.writeBoolean(message.warning);
        })

        return bytes;
    }
}