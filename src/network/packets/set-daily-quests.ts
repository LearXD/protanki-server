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

export interface IWeeklyQuestDescription {
    level: number
    progress: number
    canIncreaseProgressToday: boolean
    leftIcon: number
    rightIcon: number
}

export class SetDailyQuestsPacket extends Packet {

    public quests: IQuest[]
    public weeklyQuestDescription: IWeeklyQuestDescription

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_DAILY_QUESTS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const questCount = bytes.readInt();
        this.quests = []

        for (let i = 0; i < questCount; i++) {
            this.quests[i] = {
                freeChange: bytes.readBoolean(),
                description: bytes.readString(),
                maxProgress: bytes.readInt(),
                image: bytes.readInt(),
                prizes: new Array(bytes.readInt()).fill(0)
                    .map(() => ({
                        count: bytes.readInt(), name:
                            bytes.readString()
                    })),
                progress: bytes.readInt(),
                questId: bytes.readInt(),
                changePrice: bytes.readInt()
            }
        }

        this.weeklyQuestDescription = {
            level: bytes.readInt(),
            progress: bytes.readInt(),
            canIncreaseProgressToday: bytes.readBoolean(),
            leftIcon: bytes.readInt(),
            rightIcon: bytes.readInt()
        }

        return {
            quests: this.quests,
            weeklyQuestDescription: this.weeklyQuestDescription
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.quests.length);

        this.quests.forEach((quest) => {
            bytes.writeBoolean(quest.freeChange);
            bytes.writeString(quest.description);
            bytes.writeInt(quest.maxProgress);
            bytes.writeInt(quest.image);
            bytes.writeInt(quest.prizes.length);

            quest.prizes.forEach((prize) => {
                bytes.writeInt(prize.count);
                bytes.writeString(prize.name);
            });

            bytes.writeInt(quest.progress);
            bytes.writeInt(quest.questId);
            bytes.writeInt(quest.changePrice);

        })

        bytes.writeInt(this.weeklyQuestDescription.level);
        bytes.writeInt(this.weeklyQuestDescription.progress);
        bytes.writeBoolean(this.weeklyQuestDescription.canIncreaseProgressToday);
        bytes.writeInt(this.weeklyQuestDescription.leftIcon);
        bytes.writeInt(this.weeklyQuestDescription.rightIcon);
        return bytes;
    }
}