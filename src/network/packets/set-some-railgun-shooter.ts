import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetSomeRailgunShooterPacket extends Packet {

    private shooter: string;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SOME_RAILGUN_SHOOTER, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.shooter = bytes.readString();

        return {
            shooter: this.shooter
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(this.shooter);
        return bytes;
    }
}