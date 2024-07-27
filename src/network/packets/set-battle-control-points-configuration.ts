import { ControlPointState } from "../../utils/game/control-point-state";
import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IControlPoint {
    id: number
    name: string
    position: Vector3d
    score: number
    float_1: number
    state: string
    strings_1: string[]
}

export class SetBattleControlPointsConfigurationPacket extends Packet {

    public float_1: number
    public float_2: number
    public float_3: number
    public controlPoints: IControlPoint[]

    public resources: {
        image_1: number
        image_2: number
        image_3: number
        image_4: number
        image_5: number
        image_6: number
        image_7: number
        model: number
        image_8: number
        image_9: number
        image_10: number
        image_11: number
    }

    public sounds: {
        sound_1: number
        sound_2: number
        sound_3: number
        sound_4: number
        sound_5: number
        sound_6: number
        sound_7: number
        sound_8: number
        sound_9: number
        sound_10: number
    }

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_BATTLE_CONTROL_POINTS_CONFIGURATION, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.float_1 = bytes.readFloat();
        this.float_2 = bytes.readFloat();
        this.float_3 = bytes.readFloat();

        const points = bytes.readInt();
        this.controlPoints = new Array(points);

        for (let i = 0; i < points; i++) {
            this.controlPoints[i] = {
                id: bytes.readInt(),
                name: bytes.readString(),
                position: bytes.readVector3d(),
                score: bytes.readFloat(),
                float_1: bytes.readFloat(),
                state: ControlPointState.STATES[bytes.readInt()],
                strings_1: bytes.readStringArray()
            }
        }

        this.resources = {
            image_1: bytes.readInt(),
            image_2: bytes.readInt(),
            image_3: bytes.readInt(),
            image_4: bytes.readInt(),
            image_5: bytes.readInt(),
            image_6: bytes.readInt(),
            image_7: bytes.readInt(),
            model: bytes.readInt(),
            image_8: bytes.readInt(),
            image_9: bytes.readInt(),
            image_10: bytes.readInt(),
            image_11: bytes.readInt()
        }

        this.sounds = {
            sound_1: bytes.readInt(),
            sound_2: bytes.readInt(),
            sound_3: bytes.readInt(),
            sound_4: bytes.readInt(),
            sound_5: bytes.readInt(),
            sound_6: bytes.readInt(),
            sound_7: bytes.readInt(),
            sound_8: bytes.readInt(),
            sound_9: bytes.readInt(),
            sound_10: bytes.readInt()
        }

        return {
            float_1: this.float_1,
            float_2: this.float_2,
            float_3: this.float_3,
            controlPoints: this.controlPoints,
            resources: this.resources,
            sounds: this.sounds
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeFloat(this.float_1);
        bytes.writeFloat(this.float_2);
        bytes.writeFloat(this.float_3);

        bytes.writeInt(this.controlPoints.length);

        for (let i = 0; i < this.controlPoints.length; i++) {
            const point = this.controlPoints[i];
            bytes.writeInt(point.id);
            bytes.writeString(point.name);
            bytes.writeVector3d(point.position);
            bytes.writeFloat(point.score);
            bytes.writeFloat(point.float_1);
            bytes.writeInt(ControlPointState.STATES.indexOf(point.state));
            bytes.writeStringArray(point.strings_1);
        }

        // TODO: será que vai dar pal?
        Object.values(this.resources)
            .forEach((value) => {
                bytes.writeInt(value);
            });

        Object.values(this.sounds)
            .forEach((value) => {
                bytes.writeInt(value);
            });

        return bytes;
    }
}