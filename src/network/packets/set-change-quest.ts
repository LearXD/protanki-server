import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IPrize {
    count: number
    name: string
}

export interface IQuest {
    boolean_1: boolean
    description: string
    int_1: number
    image: number
    prizes: IPrize[]
    progress: number
    questId: number
    int_2: number
}

export class SetChangeQuestPacket extends Packet {

    public questId: number;
    public newQuest: IQuest


    constructor(bytes: ByteArray) {
        super(Protocol.SET_CHANGE_QUEST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.questId = bytes.readInt();
        this.newQuest.boolean_1 = bytes.readBoolean();
        this.newQuest.description = bytes.readString();
        this.newQuest.int_1 = bytes.readInt();
        this.newQuest.image = bytes.readInt();
        const prizeCount = bytes.readInt();
        this.newQuest.prizes = new Array(prizeCount)
        for (let j = 0; j < prizeCount; j++) {
            this.newQuest.prizes[j].count = bytes.readInt();
            this.newQuest.prizes[j].name = bytes.readString();
        }
        this.newQuest.progress = bytes.readInt();
        this.newQuest.questId = bytes.readInt();
        this.newQuest.int_2 = bytes.readInt();

        return {
            questId: this.questId,
            newQuest: this.newQuest
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.questId);
        bytes.writeBoolean(this.newQuest.boolean_1);
        bytes.writeString(this.newQuest.description);
        bytes.writeInt(this.newQuest.int_1);
        bytes.writeInt(this.newQuest.image);
        bytes.writeInt(this.newQuest.prizes.length);
        for (let j = 0; j < this.newQuest.prizes.length; j++) {
            bytes.writeInt(this.newQuest.prizes[j].count);
            bytes.writeString(this.newQuest.prizes[j].name);
        }
        bytes.writeInt(this.newQuest.progress);
        bytes.writeInt(this.newQuest.questId);
        bytes.writeInt(this.newQuest.int_2);

        return bytes;
    }
}