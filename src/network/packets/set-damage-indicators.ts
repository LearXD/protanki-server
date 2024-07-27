import { ByteArray } from "../utils/byte-array";
import { DamageIndicator, DamageIndicatorType } from "../../states/damage-indicator";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IIndicator {
    damage: number;
    type: DamageIndicatorType;
    target: string;
}

export class SetDamageIndicatorsPacket extends Packet {

    public indicators: IIndicator[];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_DAMAGE_INDICATORS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.indicators = new Array(length);

        for (let i = 0; i < length; i++) {
            this.indicators[i] = {
                damage: bytes.readFloat(),
                type: DamageIndicator.INDICATORS[bytes.readInt()] as DamageIndicatorType,
                target: bytes.readString()
            }
        }

        return {
            indicators: this.indicators
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.indicators.length);
        this.indicators.forEach(indicator => {
            bytes.writeFloat(indicator.damage);
            bytes.writeInt(DamageIndicator.INDICATORS.indexOf(indicator.type));
            bytes.writeString(indicator.target);
        })

        return bytes;
    }
}