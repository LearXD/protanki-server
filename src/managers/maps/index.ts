
import { Client } from "../../game/client";
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
        this.properties = this.server.getAssetsManager()
            .getData('maps.json');
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

    public getMap(name: string) {
        return this.getMaps()
            .find(map => map.mapId === name);
    }

    public getBattleLimits(battleMode: string) {
        return this.getBattlesLimits()
            .find(limits => limits.battleMode === battleMode);
    }

    public sendMapsData(client: Client) {
        const setMapsDataPacket = new SetMapsDataPacket(new ByteArray());
        setMapsDataPacket.data = this.properties;
        client.sendPacket(setMapsDataPacket);
    }

}