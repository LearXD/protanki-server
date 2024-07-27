import { Vector3d } from "../../utils/vector-3d";
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

    public boxes: IBox[];

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_SPAWNED_BOXES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const json = bytes.readString();

        try {
            this.boxes = JSON.parse(json);
        } catch (e) {
            console.error(e);
        }

        return {
            boxes: this.boxes
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify(this.boxes));
        return bytes;
    }
}