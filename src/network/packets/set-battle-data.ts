import { BattleMode } from "../../utils/game/battle-mode";
import { ByteArray } from "../../utils/network/byte-array";
import { EquipmentConstraintsMode } from "../../utils/game/equipment-constraints-mode";
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
    public scoreLimit: number;
    public spectator: boolean;
    public strings_1: string[];
    public lastTime: number;

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
        this.scoreLimit = bytes.readInt();
        this.spectator = bytes.readBoolean();
        this.strings_1 = bytes.readStringArray();
        this.lastTime = bytes.readInt();

        return {
            mode: this.mode,
            equipmentConstraintsMode: this.equipmentConstraintsMode,
            fund: this.fund,
            battleLimits: this.battleLimits,
            mapName: this.mapName,
            maxPeopleCount: this.maxPeopleCount,
            parkourMode: this.parkourMode,
            scoreLimit: this.scoreLimit,
            spectator: this.spectator,
            strings_1: this.strings_1,
            lastTime: this.lastTime
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
        bytes.writeInt(this.scoreLimit);
        bytes.writeBoolean(this.spectator);
        bytes.writeStringArray(this.strings_1);
        bytes.writeInt(this.lastTime);

        return bytes;
    }
}