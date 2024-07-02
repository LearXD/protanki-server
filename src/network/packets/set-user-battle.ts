import { BattleMode } from "../../utils/game/battle-mode";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserBattlePacket extends Packet {

    public battle: string
    public map: string
    public mode: string
    public private: boolean
    public pro: boolean
    //                        [max, min]
    public range: number[] = new Array(2)
    public server: number

    public user: string

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_BATTLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.battle = bytes.readString();
        this.map = bytes.readString();
        this.mode = BattleMode.ALL[bytes.readInt()];
        this.private = bytes.readBoolean();
        this.pro = bytes.readBoolean();

        this.range[0] = bytes.readInt();
        this.range[1] = bytes.readInt();

        this.server = bytes.readInt();
        this.user = bytes.readString();

        return {
            battle: this.battle,
            map: this.map,
            mode: this.mode,
            private: this.private,
            pro: this.pro,
            range: this.range,
            server: this.server,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.battle);
        bytes.writeString(this.map);
        bytes.writeInt(BattleMode.ALL.indexOf(this.mode));
        bytes.writeBoolean(this.private);
        bytes.writeBoolean(this.pro);
        bytes.writeByte(this.range[0]);
        bytes.writeByte(this.range[1]);
        bytes.writeInt(this.server);
        bytes.writeString(this.user);

        return bytes;
    }
}