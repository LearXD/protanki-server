import { ByteArray } from "../utils/byte-array";
import { Vector3d } from "../../utils/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IFlag {
    basePosition: Vector3d,
    carrier: string,
    droppedPosition: Vector3d,
}

export interface ISoundResources {
    resourceId_1: number
    resourceId_2: number
    resourceId_3: number
    resourceId_4: number
}

export class SetLoadCaptureTheFlagPacket extends Packet {

    public blueFlag: IFlag
    public blueFlagImage: number
    public blueFlagModel: number
    public redFlag: IFlag
    public redFlagImage: number
    public redFlagModel: number

    public sounds: ISoundResources

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_LOAD_CAPTURE_THE_FLAG, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.blueFlag = {
            basePosition: bytes.readVector3d(),
            carrier: bytes.readString(),
            droppedPosition: bytes.readVector3d()
        }

        this.blueFlagImage = bytes.readInt();
        this.blueFlagModel = bytes.readInt();

        this.redFlag = {
            basePosition: bytes.readVector3d(),
            carrier: bytes.readString(),
            droppedPosition: bytes.readVector3d()
        }

        this.redFlagImage = bytes.readInt();
        this.redFlagModel = bytes.readInt();

        this.sounds = {
            resourceId_1: bytes.readInt(),
            resourceId_2: bytes.readInt(),
            resourceId_3: bytes.readInt(),
            resourceId_4: bytes.readInt()
        }

        return {
            blueFlag: this.blueFlag,
            blueFlagImage: this.blueFlagImage,
            blueFlagModel: this.blueFlagModel,
            redFlag: this.redFlag,
            redFlagImage: this.redFlagImage,
            redFlagModel: this.redFlagModel,
            sounds: this.sounds
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeVector3d(this.blueFlag.basePosition);
        bytes.writeString(this.blueFlag.carrier);
        bytes.writeVector3d(this.blueFlag.droppedPosition);

        bytes.writeInt(this.blueFlagImage);
        bytes.writeInt(this.blueFlagModel);

        bytes.writeVector3d(this.redFlag.basePosition);
        bytes.writeString(this.redFlag.carrier);
        bytes.writeVector3d(this.redFlag.droppedPosition);

        bytes.writeInt(this.redFlagImage);
        bytes.writeInt(this.redFlagModel);

        bytes.writeInt(this.sounds.resourceId_1);
        bytes.writeInt(this.sounds.resourceId_2);
        bytes.writeInt(this.sounds.resourceId_3);
        bytes.writeInt(this.sounds.resourceId_4);

        return bytes;
    }
}