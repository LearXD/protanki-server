import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IBox {
    id: string,
    position: Vector3d,
    timeFromAppearing: number,
    timeLife: number,
    bonusFallSpeed: number
}

export class SetBattleSpawnedBoxesPacket extends Packet {

    public boxes: string | IBox[];

    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_SPAWNED_BOXES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        this.boxes = bytes.readString();

        try {
            this.boxes = JSON.parse(this.boxes);
        } catch (e) {
            console.error(e);
        }

        return {
            boxes: this.boxes
        }
    }

    public encode() {
        const bytes = new ByteArray();

        if (typeof this.boxes === 'object') {
            this.boxes = JSON.stringify(this.boxes);
        }

        bytes.writeString(this.boxes);

        return bytes;
    }
}