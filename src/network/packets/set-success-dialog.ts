import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSuccessDialogPacket extends Packet {

    public success: boolean
    public error: string

    constructor(bytes: ByteArray) {
        super(Protocol.SET_SUCCESS_DIALOG, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.success = bytes.readBoolean();
        this.error = bytes.readString();
        return {
            success: this.success,
            error: this.error
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeBoolean(this.success);
        bytes.writeString(this.error);
        return bytes;
    }
}