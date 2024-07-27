import { ByteArray } from "../utils/byte-array";
import { ChatModeratorLevel } from "../../states/chat-moderator-level";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetChatInitParamsPacket extends Packet {

    public admin: boolean
    public antiFloodEnabled: boolean
    public bufferSize: number
    public chatEnabled: boolean
    public chatModeratorLevel: string
    public linksWhiteList: string[]
    public minChar: number
    public minWord: number
    public selfName: string
    public showLinks: boolean
    public typingSpeedAntifloodEnabled: boolean

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CHAT_INIT_PARAMS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.admin = bytes.readBoolean();
        this.antiFloodEnabled = bytes.readBoolean();
        this.bufferSize = bytes.readInt();
        this.chatEnabled = bytes.readBoolean();
        this.chatModeratorLevel = ChatModeratorLevel.LEVELS[bytes.readInt()];
        this.linksWhiteList = bytes.readStringArray();
        this.minChar = bytes.readInt();
        this.minWord = bytes.readInt();
        this.selfName = bytes.readString();
        this.showLinks = bytes.readBoolean();
        this.typingSpeedAntifloodEnabled = bytes.readBoolean();

        return {
            admin: this.admin,
            antiFloodEnabled: this.antiFloodEnabled,
            bufferSize: this.bufferSize,
            chatEnabled: this.chatEnabled,
            chatModeratorLevel: this.chatModeratorLevel,
            linksWhiteList: this.linksWhiteList,
            minChar: this.minChar,
            minWord: this.minWord,
            selfName: this.selfName,
            showLinks: this.showLinks,
            typingSpeedAntifloodEnabled: this.typingSpeedAntifloodEnabled
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeBoolean(this.admin);
        bytes.writeBoolean(this.antiFloodEnabled);
        bytes.writeInt(this.bufferSize);
        bytes.writeBoolean(this.chatEnabled);
        bytes.writeInt(ChatModeratorLevel.LEVELS.indexOf(this.chatModeratorLevel));
        bytes.writeStringArray(this.linksWhiteList);
        bytes.writeInt(this.minChar);
        bytes.writeInt(this.minWord);
        bytes.writeString(this.selfName);
        bytes.writeBoolean(this.showLinks);
        bytes.writeBoolean(this.typingSpeedAntifloodEnabled);

        return bytes;
    }
}