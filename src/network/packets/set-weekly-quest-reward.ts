import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IWeeklyQuestReward {
    count: number
    image: number
}

export class SetWeeklyQuestRewardPacket extends Packet {

    public rewards: IWeeklyQuestReward[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_WEEKLY_QUEST_REWARD, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const rewardsLength = bytes.readInt();
        this.rewards = [];
        for (let i = 0; i < rewardsLength; i++) {
            this.rewards.push({
                count: bytes.readInt(),
                image: bytes.readInt()
            })
        }

        return {
            rewards: this.rewards
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.rewards.length);
        for (const reward of this.rewards) {
            bytes.writeInt(reward.count);
            bytes.writeInt(reward.image);
        }

        return bytes;
    }
}