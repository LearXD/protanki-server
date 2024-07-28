import { BattleMode } from "../../states/battle-mode";
import { ByteArray } from "../utils/byte-array";
import { EquipmentConstraintsMode } from "../../states/equipment-constraints-mode";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleDataPacket extends Packet {

    public mode: string;
    public equipmentConstraintsMode: string;
    public fund: number;

    public battleLimits: { scoreLimit: number, timeLimitInSec: number };
    public mapName: string;
    public maxPeopleCount: number;
    public parkourMode: boolean;
    public premiumBonusInPercent: number;
    public spectator: boolean;
    public suspiciousUsers: string[];
    public timeLeft: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.mode = BattleMode.ALL[bytes.readInt()]
        this.equipmentConstraintsMode = EquipmentConstraintsMode.ALL[bytes.readInt()];
        this.fund = bytes.readInt();
        this.battleLimits = {
            scoreLimit: bytes.readInt(),
            timeLimitInSec: bytes.readInt()
        };
        this.mapName = bytes.readString();
        this.maxPeopleCount = bytes.readInt();
        this.parkourMode = bytes.readBoolean();
        this.premiumBonusInPercent = bytes.readInt();
        this.spectator = bytes.readBoolean();
        this.suspiciousUsers = bytes.readStringArray();
        this.timeLeft = bytes.readInt();

        return {
            mode: this.mode,
            equipmentConstraintsMode: this.equipmentConstraintsMode,
            fund: this.fund,
            battleLimits: this.battleLimits,
            mapName: this.mapName,
            maxPeopleCount: this.maxPeopleCount,
            parkourMode: this.parkourMode,
            premiumBonusInPercent: this.premiumBonusInPercent,
            spectator: this.spectator,
            suspiciousUsers: this.suspiciousUsers,
            timeLeft: this.timeLeft
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(BattleMode.ALL.indexOf(this.mode));
        bytes.writeInt(EquipmentConstraintsMode.ALL.indexOf(this.equipmentConstraintsMode));
        bytes.writeInt(this.fund);
        bytes.writeInt(this.battleLimits.scoreLimit);
        bytes.writeInt(this.battleLimits.timeLimitInSec);
        bytes.writeString(this.mapName);
        bytes.writeInt(this.maxPeopleCount);
        bytes.writeBoolean(this.parkourMode);
        bytes.writeInt(this.premiumBonusInPercent);
        bytes.writeBoolean(this.spectator);
        bytes.writeStringArray(this.suspiciousUsers);
        bytes.writeInt(this.timeLeft);

        return bytes;
    }
}