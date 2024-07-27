import { BattleMode } from "../../states/battle-mode";
import { EquipmentConstraintsMode } from "../../states/equipment-constraints-mode";
import { Theme } from "../../states/theme";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

// TODO: Acho que aqui é send
export class SendCreateBattlePacket extends Packet {

    public autoBalance: boolean;
    public battleMode: string
    public equipmentConstraintsMode: string
    public friendlyFire: boolean
    public scoreLimit: number
    public timeLimitInSec: number
    public mapId: string
    public maxPeopleCount: number
    public name: string
    public parkourMode: boolean
    public privateBattle: boolean
    public proBattle: boolean
    public rankRange: { max: number, min: number } = { max: 0, min: 0 }
    public reArmorEnabled: boolean
    public theme: string
    public withoutBonuses: boolean
    public withoutCrystals: boolean
    public withoutSupplies: boolean

    constructor(bytes?: ByteArray) {
        super(Protocol.SEND_CREATE_BATTLE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.autoBalance = bytes.readBoolean();
        this.battleMode = BattleMode.ALL[bytes.readInt()];
        this.equipmentConstraintsMode = EquipmentConstraintsMode.ALL[bytes.readInt()];
        this.friendlyFire = bytes.readBoolean();
        this.scoreLimit = bytes.readInt();
        this.timeLimitInSec = bytes.readInt();
        this.mapId = bytes.readString();
        this.maxPeopleCount = bytes.readInt();
        this.name = bytes.readString();
        this.parkourMode = bytes.readBoolean();
        this.privateBattle = bytes.readBoolean();
        this.proBattle = bytes.readBoolean();

        this.rankRange.max = bytes.readInt();
        this.rankRange.min = bytes.readInt();

        this.reArmorEnabled = bytes.readBoolean();
        this.theme = Theme.THEMES[bytes.readInt()];
        this.withoutBonuses = bytes.readBoolean();
        this.withoutCrystals = bytes.readBoolean();
        this.withoutSupplies = bytes.readBoolean();

        return {
            autoBalance: this.autoBalance,
            battleMode: this.battleMode,
            equipmentConstraintsMode: this.equipmentConstraintsMode,
            friendlyFire: this.friendlyFire,
            scoreLimit: this.scoreLimit,
            timeLimitInSec: this.timeLimitInSec,
            mapId: this.mapId,
            maxPeopleCount: this.maxPeopleCount,
            name: this.name,
            parkourMode: this.parkourMode,
            privateBattle: this.privateBattle,
            proBattle: this.proBattle,
            rankRange: this.rankRange,
            reArmorEnabled: this.reArmorEnabled,
            theme: this.theme,
            withoutBonuses: this.withoutBonuses,
            withoutCrystals: this.withoutCrystals,
            withoutSupplies: this.withoutSupplies
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeBoolean(this.autoBalance);
        bytes.writeInt(BattleMode.ALL.indexOf(this.battleMode));
        bytes.writeInt(EquipmentConstraintsMode.ALL.indexOf(this.equipmentConstraintsMode));
        bytes.writeBoolean(this.friendlyFire);
        bytes.writeInt(this.scoreLimit);
        bytes.writeInt(this.timeLimitInSec);
        bytes.writeString(this.mapId);
        bytes.writeInt(this.maxPeopleCount);
        bytes.writeString(this.name);
        bytes.writeBoolean(this.parkourMode);
        bytes.writeBoolean(this.privateBattle);
        bytes.writeBoolean(this.proBattle);

        bytes.writeInt(this.rankRange.max);
        bytes.writeInt(this.rankRange.min);

        bytes.writeBoolean(this.reArmorEnabled);
        bytes.writeInt(Theme.THEMES.indexOf(this.theme));
        bytes.writeBoolean(this.withoutBonuses);
        bytes.writeBoolean(this.withoutCrystals);
        bytes.writeBoolean(this.withoutSupplies);
        return bytes;
    }
}