import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetRemoveUserFromViewingTeamBattlePacket extends Packet {

    public battleId: string;
    public userId: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_REMOVE_USER_FROM_VIEWING_TEAM_BATTLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battleId = bytes.readString();
        this.userId = bytes.readString();

        return {
            battleId: this.battleId,
            userId: this.userId
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battleId);
        bytes.writeString(this.userId);

        return bytes;
    }
}