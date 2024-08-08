import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IEffect {
    userID: string,
    itemIndex: number,
    durationTime: number,
    effectLevel: number,
}

export class SetBattleUsersEffectsPacket extends Packet {

    public effects: IEffect[] = [];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_USERS_EFFECTS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.effects = JSON.parse(json).effects;
        } catch (e) {
            console.error(e);
        }

        return {
            effects: this.effects
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify({ effects: this.effects }));
        return bytes;
    }
}