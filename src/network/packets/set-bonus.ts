import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetBonusPacket extends Packet {

    public lifeTimeInSecondsFromCurrentDateTime: number;
    public crystalBonusInPercent: number;
    public scoreBonusInPercent: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BONUS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.lifeTimeInSecondsFromCurrentDateTime = bytes.readInt();
        this.crystalBonusInPercent = bytes.readInt();
        this.scoreBonusInPercent = bytes.readInt();

        return {
            lifeTimeInSecondsFromCurrentDateTime: this.lifeTimeInSecondsFromCurrentDateTime,
            crystalBonusInPercent: this.crystalBonusInPercent,
            scoreBonusInPercent: this.scoreBonusInPercent
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.lifeTimeInSecondsFromCurrentDateTime);
        bytes.writeInt(this.crystalBonusInPercent);
        bytes.writeInt(this.scoreBonusInPercent);

        return bytes;
    }
}