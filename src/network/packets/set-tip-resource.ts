import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetTipResourcePacket extends Packet {

    public resourceId: number;

    constructor(bytes: ByteArray) {
        super(Protocol.SET_TIP_RESOURCE, bytes)
    }

    public decode() {
        const bytes = new ByteArray(this.getBytes().buffer)
        const resourceId = bytes.readInt();
        return { resourceId };
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.resourceId);
        return bytes;
    }

}