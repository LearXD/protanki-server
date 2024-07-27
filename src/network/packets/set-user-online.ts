import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetUserOnlinePacket extends Packet {

    public online: boolean;
    public serverNumber: number;
    public user: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_ONLINE, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.online = bytes.readBoolean();
        this.serverNumber = bytes.readInt();
        this.user = bytes.readString();

        return {
            online: this.online,
            serverNumber: this.serverNumber,
            user: this.user
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeBoolean(this.online);
        bytes.writeInt(this.serverNumber);
        bytes.writeString(this.user);

        return bytes;
    }
}