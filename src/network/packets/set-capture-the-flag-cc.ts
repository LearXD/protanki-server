import { ByteArray } from "../../utils/network/byte-array";
import { Vector3d } from "../../utils/game/vector-3d";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IFlag {
    vector3d_1: Vector3d,
    string_1: string,
    vector3d_2: Vector3d,
}

export interface ISoundResources {
    resourceId_1: number
    resourceId_2: number
    resourceId_3: number
    resourceId_4: number
}

export class SetCaptureTheFlagCCPacket extends Packet {

    public flag_1: IFlag
    public flag_1_image: number
    public flag_1_model: number
    public flag_2: IFlag
    public flag_2_image: number
    public flag_2_model: number

    public sounds: ISoundResources

    constructor(bytes: ByteArray) {
        super(Protocol.SET_CAPTURE_THE_FLAG_CC, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.flag_1 = {
            vector3d_1: bytes.readVector3d(),
            string_1: bytes.readString(),
            vector3d_2: bytes.readVector3d()
        }

        this.flag_1_image = bytes.readInt();
        this.flag_1_model = bytes.readInt();

        this.flag_2 = {
            vector3d_1: bytes.readVector3d(),
            string_1: bytes.readString(),
            vector3d_2: bytes.readVector3d()
        }

        this.flag_2_image = bytes.readInt();
        this.flag_2_model = bytes.readInt();

        this.sounds = {
            resourceId_1: bytes.readInt(),
            resourceId_2: bytes.readInt(),
            resourceId_3: bytes.readInt(),
            resourceId_4: bytes.readInt()
        }

        return {
            flag_1: this.flag_1,
            flag_1_image: this.flag_1_image,
            flag_1_model: this.flag_1_model,
            flag_2: this.flag_2,
            flag_2_image: this.flag_2_image,
            flag_2_model: this.flag_2_model,
            sounds: this.sounds
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeVector3d(this.flag_1.vector3d_1);
        bytes.writeString(this.flag_1.string_1);
        bytes.writeVector3d(this.flag_1.vector3d_2);

        bytes.writeInt(this.flag_1_image);
        bytes.writeInt(this.flag_1_model);

        bytes.writeVector3d(this.flag_2.vector3d_1);
        bytes.writeString(this.flag_2.string_1);
        bytes.writeVector3d(this.flag_2.vector3d_2);

        bytes.writeInt(this.flag_2_image);
        bytes.writeInt(this.flag_2_model);

        bytes.writeInt(this.sounds.resourceId_1);
        bytes.writeInt(this.sounds.resourceId_2);
        bytes.writeInt(this.sounds.resourceId_3);
        bytes.writeInt(this.sounds.resourceId_4);

        return bytes;
    }
}