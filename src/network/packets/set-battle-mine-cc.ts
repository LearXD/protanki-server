import { Vector3d } from "../../utils/game/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IMine {
    activated: boolean;
    mineId: string;
    ownerId: string;
    position?: Vector3d;
}

export class SetBattleMineCCPacket extends Packet {

    public soundResource: number; // ResourceGetterCodec
    public int_1: number; //IntCodec
    public mines: IMine[]; //VectorCodecBattleMine
    public imageResource: number; //ResourceGetterCodec
    public soundResource2: number; //ResourceGetterCodec
    public imageResource2: number; //ResourceGetterCodec
    public explosionMarkTexture: number; //ResourceGetterCodec
    public explosionSound: number; //ResourceGetterCodec
    public float_1: number; //FloatCodec
    public imageResource3: number; //ResourceGetterCodec
    public frameResource: number; //ResourceGetterCodec
    public impactForce: number; //FloatCodec
    public frameResource2: number; //ResourceGetterCodec
    public float_2: number; //FloatCodec
    public model3dResource: number; //ResourceGetterCodec
    public float_3: number; //FloatCodec
    public radius: number; //FloatCodec
    public imageResource4: number; //ResourceGetterCodec


    constructor(bytes: ByteArray) {
        super(Protocol.SET_BATTLE_MINE_CC, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.soundResource = bytes.readInt();
        this.int_1 = bytes.readInt();

        const length = bytes.readInt();
        this.mines = new Array(length);

        for (let i = 0; i < length; i++) {
            this.mines[i] = {
                activated: true, // já veio true
                mineId: bytes.readString(),
                ownerId: bytes.readString(),
                position: bytes.readVector3d()
            }
        }

        this.imageResource = bytes.readInt();
        this.soundResource2 = bytes.readInt();
        this.imageResource2 = bytes.readInt();
        this.explosionMarkTexture = bytes.readInt();
        this.explosionSound = bytes.readInt();
        this.float_1 = bytes.readFloat();
        this.imageResource3 = bytes.readInt();
        this.frameResource = bytes.readInt();
        this.impactForce = bytes.readFloat();
        this.frameResource2 = bytes.readInt();
        this.float_2 = bytes.readFloat();
        this.model3dResource = bytes.readInt();
        this.float_3 = bytes.readFloat();
        this.radius = bytes.readFloat();
        this.imageResource4 = bytes.readInt();


        return {
            soundResource: this.soundResource,
            int_1: this.int_1,
            mines: this.mines,
            imageResource: this.imageResource,
            soundResource2: this.soundResource2,
            imageResource2: this.imageResource2,
            explosionMarkTexture: this.explosionMarkTexture,
            explosionSound: this.explosionSound,
            float_1: this.float_1,
            imageResource3: this.imageResource3,
            frameResource: this.frameResource,
            impactForce: this.impactForce,
            frameResource2: this.frameResource2,
            float_2: this.float_2,
            model3dResource: this.model3dResource,
            float_3: this.float_3,
            radius: this.radius,
            imageResource4: this.imageResource4
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeInt(this.soundResource);
        bytes.writeInt(this.int_1);
        bytes.writeInt(this.mines.length);

        this.mines.forEach((mine: IMine) => {
            bytes.writeString(mine.mineId);
            bytes.writeString(mine.ownerId);
            bytes.writeVector3d(mine.position);
        });

        bytes.writeInt(this.imageResource);
        bytes.writeInt(this.soundResource2);
        bytes.writeInt(this.imageResource2);
        bytes.writeInt(this.explosionMarkTexture);
        bytes.writeInt(this.explosionSound);
        bytes.writeFloat(this.float_1);
        bytes.writeInt(this.imageResource3);
        bytes.writeInt(this.frameResource);
        bytes.writeFloat(this.impactForce);
        bytes.writeInt(this.frameResource2);
        bytes.writeFloat(this.float_2);
        bytes.writeInt(this.model3dResource);
        bytes.writeFloat(this.float_3);
        bytes.writeFloat(this.radius);
        bytes.writeInt(this.imageResource4);

        return bytes;
    }
}