import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

interface SpecialEntity {
    chargingTimeMsec: number;
    weakeningCoeff: number;
}

interface Weapon {
    auto_aiming_down: number;
    auto_aiming_up: number;
    num_rays_down: number;
    num_rays_up: number;
    reload: number;
    id: string;
    has_wwd: boolean;
    special_entity: SpecialEntity;
}

export class SetTurretsDataPacket extends Packet {

    public turrets: Weapon[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_TURRETS_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.turrets = JSON.parse(json).weapons;
        } catch (e) {
            console.error(e);
        }

        return {
            turrets: this.turrets
        }
    }

    public encode() {
        const bytes = new ByteArray();
        try {
            bytes.writeString(JSON.stringify({ weapons: this.turrets }));
        } catch (e) {
            console.error(e);
        }
        return bytes;
    }
}