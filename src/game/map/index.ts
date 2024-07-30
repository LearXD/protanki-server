import { IMap } from "./types";

export class Map {
    public constructor(
        public readonly data: IMap,
    ) {

    }

    public getName() {
        return this.data.mapName;
    }

    public getId() {
        return this.data.mapId;
    }

    public getTheme() {
        return this.data.theme;
    }

    public getPreview() {
        return this.data.preview;
    }

    public getMaxPeople() {
        return this.data.maxPeople;
    }

    public getMinRank() {
        return this.data.minRank;
    }

    public getMaxRank() {
        return this.data.maxRank;
    }

    public getSupportedModes() {
        return this.data.supportedModes;
    }

    public getAdditionalCrystalsPercent() {
        return this.data.additionalCrystalsPercent;
    }

    public isEnabled() {
        return this.data.enabled;
    }
}