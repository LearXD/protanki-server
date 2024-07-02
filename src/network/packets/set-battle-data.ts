import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBattleData {
    kick_period_ms: number;
    map_id: string;
    mapId: number;
    invisible_time: number;
    spectator: boolean;
    active: boolean;
    dustParticle: number;
    battleId: string;
    minRank: number;
    maxRank: number;
    skybox: string;
    sound_id: number;
    map_graphic_data: string;
    reArmorEnabled: boolean;
    bonusLightIntensity: number;
    lighting: string;
}

export class SetBattleDataPacket extends Packet {

    public data: IBattleData;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_DATA, bytes)
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