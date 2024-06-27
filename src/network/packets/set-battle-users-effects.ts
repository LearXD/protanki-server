import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleUsersEffectsPacket extends Packet {

    public effects: string | object;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_USERS_EFFECTS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.effects = bytes.readString();

        try {
            this.effects = JSON.parse(this.effects);
        } catch (e) {
            console.error(e);
        }

        return {
            effects: this.effects
        }
    }

    public encode() {
        const bytes = new ByteArray();

        if (typeof this.effects === 'object') {
            this.effects = JSON.stringify(this.effects);
        }

        bytes.writeString(this.effects);

        return bytes;
    }
}