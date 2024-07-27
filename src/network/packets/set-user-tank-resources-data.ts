import { IVector3d, Vector3d } from "../../utils/vector-3d";
import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface IUserTankResourcesData {
    battleId: string,
    colormap_id: number,
    hull_id: string,
    turret_id: string,
    team_type: string,
    partsObject: string,
    hullResource: number,
    turretResource: number,
    sfxData: string,
    position: IVector3d,
    orientation: IVector3d,
    incarnation: number,
    tank_id: string,
    nickname: string,
    state: string,
    maxSpeed: number,
    maxTurnSpeed: number,
    acceleration: number,
    reverseAcceleration: number,
    sideAcceleration: number,
    turnAcceleration: number,
    reverseTurnAcceleration: number,
    mass: number,
    power: number,
    dampingCoeff: number,
    turret_turn_speed: number,
    health: number,
    rank: number,
    kickback: number,
    turretTurnAcceleration: number,
    impact_force: number,
    state_null: boolean
}

export class SetUserTankResourcesDataPacket extends Packet {

    public data: IUserTankResourcesData;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_USER_TANK_RESOURCES_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();
        const data = bytes.readString();

        try {
            this.data = JSON.parse(data);
        } catch (e) {
            console.error(e);
        }

        return {
            data: this.data
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeString(JSON.stringify(this.data));
        return bytes;
    }
}