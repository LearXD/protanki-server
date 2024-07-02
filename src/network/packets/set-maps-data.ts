import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

interface BattleLimit {
    battleMode: string;
    scoreLimit: number;
    timeLimitInSec: number;
}

interface Map {
    enabled: boolean;
    additionalCrystalsPercent: number;
    mapId: string;
    mapName: string;
    maxPeople: number;
    preview: number;
    maxRank: number;
    minRank: number;
    supportedModes: string[];
    theme: string;
}

interface IMapData {
    maxRangeLength: number;
    battleCreationDisabled: boolean;
    battleLimits: BattleLimit[];
    maps: Map[];
}

export class SetMapsDataPacket extends Packet {

    public data: IMapData

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_MAPS_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.data = JSON.parse(json);
        } catch (e) {
            console.error(e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify(this.data));
        return bytes;
    }
}