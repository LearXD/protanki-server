import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSuccessfulPurchasePacket extends Packet {

    public donation: number
    public packageBonusCrystals: number
    public bonusCrystals: number
    public image: number

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SUCCESSFUL_PURCHASE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.donation = bytes.readInt();
        this.packageBonusCrystals = bytes.readInt();
        this.bonusCrystals = bytes.readInt();
        this.image = bytes.readInt();

        return {
            donation: this.donation,
            packageBonusCrystals: this.packageBonusCrystals,
            bonusCrystals: this.bonusCrystals,
            image: this.image
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.donation);
        bytes.writeInt(this.packageBonusCrystals);
        bytes.writeInt(this.bonusCrystals);
        bytes.writeInt(this.image);

        return bytes;
    }
}