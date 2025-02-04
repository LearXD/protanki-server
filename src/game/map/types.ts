import { BattleMode } from "@/states/battle-mode";
import { TeamType } from "@/states/team";
import { IVector3d } from "@/utils/vector-3d/types";

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

export interface IMapFlags {
    red: IVector3d,
    blue: IVector3d
}

export interface IMapPoint {
    name: string
    position: IVector3d
}

export enum MapAreaAction {
    KICK = 'kick',
    KILL = 'kill',
}

export interface IMapArea {
    minX: number
    minY: number
    minZ: number
    maxX: number
    maxY: number
    maxZ: number
    action: MapAreaAction
}

export enum BonusType {
    GOLD = 'gold',
    CRYSTAL = 'crystal',
    ARMOR = 'armor',
    NITRO = 'nitro',
    HEALTH = 'health',
    DAMAGE = 'damage',
}

export interface IBonusSpawnArea {
    rotation: IVector3d
    min: IVector3d
    max: IVector3d
    position: IVector3d
    name: string
    parachute: boolean
    free: boolean
    types: BonusType[]
    modes: BattleMode[]
}

export interface IMapProperties {
    mapId: number
    dustParticle: number
    skybox: {
        top: number
        front: number
        back: number
        bottom: number
        left: number
        right: number
    }
    sound_id: number
    map_graphic_data: {
        mapId: string
        mapTheme: string
        angleX: number
        angleZ: number
        lightColor: number
        shadowColor: number
        fogAlpha: number
        fogColor: number
        farLimit: number
        nearLimit: number
        gravity: number
        skyboxRevolutionSpeed: number
        ssaoColor: number
        dustAlpha: number
        dustDensity: number
        dustFarDistance: number
        dustNearDistance: number
        dustParticle: string
        dustSize: number
    }
    bonusLightIntensity: number
    lighting: {
        ctfLighting: {
            redColor: number
            redColorIntensity: number
            blueColor: number
            blueColorIntensity: number
            attenuationBegin: number
            attenuationEnd: number
        }
        dominationLighting: {
            redPointColor: number
            redPointIntensity: number
            bluePointColor: number
            bluePointIntensity: number
            neutralPointColor: number
            neutralPointIntensity: number
            attenuationBegin: number
            attenuationEnd: number
        }
    }
}