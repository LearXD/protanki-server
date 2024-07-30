import { TeamType } from "@/states/team";
import { IVector3d } from "@/utils/vector-3d";

export interface IMapData {
    enabled: boolean;
    additionalCrystalsPercent: number;
    mapId: string;
    mapName: string;
    maxPeople: number;
    preview: number;
    maxRank: number;
    minRank: number;
    supportedModes: string[];
    theme: string;
}

export interface IMapSpawn {
    type: string
    team?: TeamType
    rotation: IVector3d
    position: IVector3d
    point_id?: string
}