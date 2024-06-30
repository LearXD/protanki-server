import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBonus {
    id: string;
    resourceId: number;
    lifeTimeMs: number;
    lighting: {
        attenuationBegin: number;
        attenuationEnd: number;
        color: number;
        intensity: number;
    }
}

export interface IData {
    bonuses: IBonus[];
    cordResource: number;
    parachuteInnerResource: number;
    parachuteResource: number;
    pickupSoundResource: number;
}


export class SetBonusesDataPacket extends Packet {

    public data: IData = {
        bonuses: [],
        cordResource: 0,
        parachuteInnerResource: 0,
        parachuteResource: 0,
        pickupSoundResource: 0
    };

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BONUSES_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            const data = JSON.parse(json);
            this.data.bonuses = data.bonuses;
            this.data.cordResource = data.cordResource;
            this.data.parachuteInnerResource = data.parachuteInnerResource;
            this.data.parachuteResource = data.parachuteResource;
            this.data.pickupSoundResource = data.pickupSoundResource
        } catch (e) {
            console.error(e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();

        try {
            bytes.writeString(JSON.stringify({
                bonuses: this.data.bonuses,
                cordResource: this.data.cordResource,
                parachuteInnerResource: this.data.parachuteInnerResource,
                parachuteResource: this.data.parachuteResource,
                pickupSoundResource: this.data.pickupSoundResource
            }));
        } catch (e) {
            console.error(e);
        }

        return bytes;
    }
}