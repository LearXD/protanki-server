import { ControlPointState, ControlPointStateType } from "../../states/control-point-state";
import { Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IControlPoint {
    id: number
    name: string
    position: Vector3d
    score: number
    scoreChangeRate: number
    state: ControlPointStateType
    tankIds: string[]
}

export class SetLoadControlPointPacket extends Packet {

    public keypointTriggerRadius: number
    public keypointVisorHeight: number
    public minesRestrictionRadius: number
    public controlPoints: IControlPoint[]

    public resources: {
        bigLetters: number
        blueCircle: number
        bluePedestalTexture: number
        blueRay: number
        blueRayTip: number
        neutralCircle: number
        neutralPedestalTexture: number
        pedestal: number
        redCircle: number
        redPedestalTexture: number
        redRay: number
        redRayTip: number
    }

    public sounds: {
        pointCaptureStartNegativeSound: number
        pointCaptureStartPositiveSound: number
        pointCaptureStopNegativeSound: number
        pointCaptureStopPositiveSound: number
        pointCapturedNegativeSound: number
        pointCapturedPositiveSound: number
        pointNeutralizedNegativeSound: number
        pointNeutralizedPositiveSound: number
        pointScoreDecreasingSound: number
        pointScoreIncreasingSound: number
    }

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LOAD_CONTROL_POINT, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.keypointTriggerRadius = bytes.readFloat();
        this.keypointVisorHeight = bytes.readFloat();
        this.minesRestrictionRadius = bytes.readFloat();

        const points = bytes.readInt();
        this.controlPoints = new Array(points);

        for (let i = 0; i < points; i++) {
            this.controlPoints[i] = {
                id: bytes.readInt(),
                name: bytes.readString(),
                position: bytes.readVector3d(),
                score: bytes.readFloat(),
                scoreChangeRate: bytes.readFloat(),
                state: ControlPointState.STATES[bytes.readInt()],
                tankIds: bytes.readStringArray()
            }
        }

        this.resources = {
            bigLetters: bytes.readInt(),
            blueCircle: bytes.readInt(),
            bluePedestalTexture: bytes.readInt(),
            blueRay: bytes.readInt(),
            blueRayTip: bytes.readInt(),
            neutralCircle: bytes.readInt(),
            neutralPedestalTexture: bytes.readInt(),
            pedestal: bytes.readInt(),
            redCircle: bytes.readInt(),
            redPedestalTexture: bytes.readInt(),
            redRay: bytes.readInt(),
            redRayTip: bytes.readInt()
        }

        this.sounds = {
            pointCaptureStartNegativeSound: bytes.readInt(),
            pointCaptureStartPositiveSound: bytes.readInt(),
            pointCaptureStopNegativeSound: bytes.readInt(),
            pointCaptureStopPositiveSound: bytes.readInt(),
            pointCapturedNegativeSound: bytes.readInt(),
            pointCapturedPositiveSound: bytes.readInt(),
            pointNeutralizedNegativeSound: bytes.readInt(),
            pointNeutralizedPositiveSound: bytes.readInt(),
            pointScoreDecreasingSound: bytes.readInt(),
            pointScoreIncreasingSound: bytes.readInt()
        }

        return {
            float_1: this.keypointTriggerRadius,
            float_2: this.keypointVisorHeight,
            float_3: this.minesRestrictionRadius,
            controlPoints: this.controlPoints,
            resources: this.resources,
            sounds: this.sounds
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeFloat(this.keypointTriggerRadius);
        bytes.writeFloat(this.keypointVisorHeight);
        bytes.writeFloat(this.minesRestrictionRadius);

        bytes.writeInt(this.controlPoints.length);

        for (let i = 0; i < this.controlPoints.length; i++) {
            const point = this.controlPoints[i];
            bytes.writeInt(point.id);
            bytes.writeString(point.name);
            bytes.writeVector3d(point.position);
            bytes.writeFloat(point.score);
            bytes.writeFloat(point.scoreChangeRate);
            bytes.writeInt(ControlPointState.STATES.indexOf(point.state));
            bytes.writeStringArray(point.tankIds);
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