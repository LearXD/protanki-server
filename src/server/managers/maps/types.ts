export interface IBattleLimit {
    battleMode: string;
    scoreLimit: number;
    timeLimitInSec: number;
}

export interface IMap {
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

export interface IMapLibrary {
    name: string;
    id: number;
    version: number;
}

export interface IBattleAsset {
    maxRangeLength: number;
    battleCreationDisabled: boolean;
    battleLimits: IBattleLimit[];
    maps: IMap[]
}
