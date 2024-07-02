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
    maxProgress: number
    image: number
    prizes: IPrize[]
    progress: number
    questId: number
    int_2: number
}

export interface IWeeklyQuestDescription {
    int_1: number
    int_2: number
    boolean_1: boolean
    resource_1: number
    resource_2: number
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
                boolean_1: bytes.readBoolean(),
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
                int_2: bytes.readInt()
            }
        }

        this.weeklyQuestDescription = {
            int_1: bytes.readInt(),
            int_2: bytes.readInt(),
            boolean_1: bytes.readBoolean(),
            resource_1: bytes.readInt(),
            resource_2: bytes.readInt()
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
            bytes.writeBoolean(quest.boolean_1);
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
            bytes.writeInt(quest.int_2);

        })

        bytes.writeInt(this.weeklyQuestDescription.int_1);
        bytes.writeInt(this.weeklyQuestDescription.int_2);
        bytes.writeBoolean(this.weeklyQuestDescription.boolean_1);
        bytes.writeInt(this.weeklyQuestDescription.resource_1);
        bytes.writeInt(this.weeklyQuestDescription.resource_2);
        return bytes;
    }
}