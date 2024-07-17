import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IPrize {
    count: number
    name: string
}

export interface IQuest {
    freeChange: boolean
    description: string
    maxProgress: number
    image: number
    prizes: IPrize[]
    progress: number
    questId: number
    changePrice: number
}

export class SetChangeDailyQuestPacket extends Packet {

    public questId: number;
    public dailyQuest: IQuest

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_CHANGE_DAILY_QUEST, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.questId = bytes.readInt();
        this.dailyQuest = {
            freeChange: bytes.readBoolean(),
            description: bytes.readString(),
            maxProgress: bytes.readInt(),
            image: bytes.readInt(),
            prizes: Array.from({ length: bytes.readInt() })
                .map(() => {
                    return {
                        count: bytes.readInt(),
                        name: bytes.readString()
                    }
                }),
            progress: bytes.readInt(),
            questId: bytes.readInt(),
            changePrice: bytes.readInt()
        }

        return {
            questId: this.questId,
            dailyQuest: this.dailyQuest
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.questId);
        bytes.writeBoolean(this.dailyQuest.freeChange);
        bytes.writeString(this.dailyQuest.description);
        bytes.writeInt(this.dailyQuest.maxProgress);
        bytes.writeInt(this.dailyQuest.image);
        bytes.writeInt(this.dailyQuest.prizes.length);
        for (let j = 0; j < this.dailyQuest.prizes.length; j++) {
            bytes.writeInt(this.dailyQuest.prizes[j].count);
            bytes.writeString(this.dailyQuest.prizes[j].name);
        }
        bytes.writeInt(this.dailyQuest.progress);
        bytes.writeInt(this.dailyQuest.questId);
        bytes.writeInt(this.dailyQuest.changePrice);

        return bytes;
    }
}