import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SendShaftLocalSpotPacket extends Packet {

    public tank: string;
    public localSpotPosition: Vector3d;

    constructor(bytes: ByteArray) {
        super(Protocol.SEND_SHAFT_LOCAL_SPOT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.tank = bytes.readString();
        this.localSpotPosition = bytes.readVector3d();

        return {
            tank: this.tank,
            localSpotPosition: this.localSpotPosition
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeString(this.tank);
        bytes.writeVector3d(this.localSpotPosition);

        return bytes;
    }
}