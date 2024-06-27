import { BattleMode } from "../../utils/game/battle-mode";
import { ByteArray } from "../../utils/network/byte-array";
import { EquipmentConstraintsMode } from "../../utils/game/equipment-constraints-mode";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBattleStatisticsCCPacket extends Packet {

    public mode: string;
    public equipmentConstraintsMode: string;
    public fund: number;

    public battleLimits: { scoreLimit: number, timeLimitInSec: number };
    public map: string;
    public maxPeopleCount: number;
    public parkourMode: boolean;
    public int_1: number;
    public spectator: boolean;
    public strings_1: string[];
    public int_2: number;


    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_STATISTICS_CC, bytes)
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
        this.map = bytes.readString();
        this.maxPeopleCount = bytes.readInt();
        this.parkourMode = bytes.readBoolean();
        this.int_1 = bytes.readInt();
        this.spectator = bytes.readBoolean();
        this.strings_1 = bytes.readStringArray();
        this.int_2 = bytes.readInt();

        return {
            mode: this.mode,
            equipmentConstraintsMode: this.equipmentConstraintsMode,
            fund: this.fund,
            battleLimits: this.battleLimits,
            map: this.map,
            maxPeopleCount: this.maxPeopleCount,
            parkourMode: this.parkourMode,
            int_1: this.int_1,
            spectator: this.spectator,
            strings_1: this.strings_1,
            int_2: this.int_2
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.mode);
        bytes.writeInt(EquipmentConstraintsMode.ALL.indexOf(this.equipmentConstraintsMode));
        bytes.writeInt(this.fund);
        bytes.writeInt(this.battleLimits.scoreLimit);
        bytes.writeInt(this.battleLimits.timeLimitInSec);
        bytes.writeString(this.map);
        bytes.writeInt(this.maxPeopleCount);
        bytes.writeBoolean(this.parkourMode);
        bytes.writeInt(this.int_1);
        bytes.writeBoolean(this.spectator);
        bytes.writeStringArray(this.strings_1);
        bytes.writeInt(this.int_2);

        return bytes;
    }
}