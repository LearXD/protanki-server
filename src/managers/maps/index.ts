
import path from "path";
import { Player } from "../../game/player";
import { SetMapsDataPacket } from "../../network/packets/set-maps-data";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

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

export interface IBattleAsset {
    maxRangeLength: number;
    battleCreationDisabled: boolean;
    battleLimits: IBattleLimit[];
    maps: IMap[]
}

export class MapsManager {

    private properties: IBattleAsset;

    constructor(
        private readonly server: Server
    ) {
        this.init();
    }

    public init() {
        this.properties = this.getData('maps.json');
    }

    public getMapResource(map: string, theme: string, resource: string) {
        return this.getData(
            path.join(map, theme, 'resources', resource)
        );
    }

    public getMapData(map: string, theme: string) {
        return this.getData(
            path.join(map, theme, 'data.json')
        );
    }

    public getData(_path: string) {
        return this.server.getAssetsManager()
            .getData(path.join('maps', _path));
    }

    public getMaps() {
        return this.properties.maps;
    }

    public getBattlesLimits() {
        return this.properties.battleLimits;
    }

    public getProperties() {
        return this.properties;
    }

    public getMap(name: string, theme: string = 'SUMMER') {
        return this.getMaps()
            .find(map => (map.mapId === name && map.theme === theme));
    }

    public getBattleLimits(battleMode: string) {
        return this.getBattlesLimits()
            .find(limits => limits.battleMode === battleMode);
    }

    public sendMapsData(client: Player) {
        const setMapsDataPacket = new SetMapsDataPacket(new ByteArray());
        setMapsDataPacket.data = this.properties;
        client.sendPacket(setMapsDataPacket);
    }

}