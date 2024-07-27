import { BattleMode } from "../../states/battle-mode";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleInvitePacket extends Packet {

    public user: string

    public availableRank: boolean
    public availableSlot: boolean
    public battleId: string
    public mapName: string
    public mode: string
    public noSuppliesBattle: boolean
    public privateBattle: boolean
    public remote: boolean
    public serverNumber: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_INVITE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.user = bytes.readString();
        this.availableRank = bytes.readBoolean();
        this.availableSlot = bytes.readBoolean();
        this.battleId = bytes.readString();
        this.mapName = bytes.readString();
        this.mode = BattleMode.ALL[bytes.readInt()];
        this.noSuppliesBattle = bytes.readBoolean();
        this.privateBattle = bytes.readBoolean();
        this.remote = false;
        this.serverNumber = 1;

        return {
            user: this.user,
            availableRank: this.availableRank,
            availableSlot: this.availableSlot,
            battleId: this.battleId,
            mapName: this.mapName,
            mode: this.mode,
            noSuppliesBattle: this.noSuppliesBattle,
            privateBattle: this.privateBattle,
            remote: this.remote,
            serverNumber: this.serverNumber
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.user);
        bytes.writeBoolean(this.availableRank);
        bytes.writeBoolean(this.availableSlot);
        bytes.writeString(this.battleId);
        bytes.writeString(this.mapName);
        bytes.writeInt(BattleMode.ALL.indexOf(this.mode));
        bytes.writeBoolean(this.noSuppliesBattle);
        bytes.writeBoolean(this.privateBattle);
        // TODO: add remote and serverNumber

        return bytes;
    }
}