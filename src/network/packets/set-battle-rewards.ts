import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IReward {
    kills: number
    deaths: number
    reward: number
    user: string
}

export class SetBattleRewardsPacket extends Packet {

    public rewards: any[]
    public timeToRestart: number

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_REWARDS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.rewards = new Array(length);

        for (let i = 0; i < length; i++) {
            this.rewards[i] = {
                kills: bytes.readInt(),
                deaths: bytes.readInt(),
                reward: bytes.readInt(),
                user: bytes.readString()
            }
        }

        this.timeToRestart = bytes.readInt();

        return {
            rewards: this.rewards,
            timeToRestart: this.timeToRestart
        }
    }

    public encode() {
        const bytes = new ByteArray();

        return bytes;
    }
}