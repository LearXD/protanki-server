import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAddSpecialItemPacket extends Packet {

    public image: number;
    public bottomText: string;
    public topText: string;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_ADD_SPECIAL_ITEM, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.image = bytes.readInt();
        this.bottomText = bytes.readString();
        this.topText = bytes.readString();

        return {
            image: this.image,
            bottomText: this.bottomText,
            topText: this.topText
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.image);
        bytes.writeString(this.bottomText);
        bytes.writeString(this.topText);

        return bytes;
    }
}