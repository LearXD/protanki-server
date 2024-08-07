
import path from "path";

import { IBattleAsset, IMapLibrary } from "./types";
import { Server } from "@/server";
import { Logger } from "@/utils/logger";
import { Theme, ThemeType } from "@/states/theme";
import { Player } from "@/game/player";
import { SetMapsDataPacket } from "@/network/packets/set-maps-data";
import { Map } from "@/game/map";
import { ReadType } from "../assets/types";

export class MapsManager {

    private data: IBattleAsset;
    private loadedMaps: Map[] = [];

    constructor(
        private readonly server: Server
    ) {
        Logger.info('Initializing battle and maps data...');
        this.data = this.getData('maps.json');
        Logger.info(`Loaded ${this.data.maps.length} maps and ${this.data.battleLimits.length} battle limits`);
    }

    public getData(_path: string, readType?: ReadType) {
        return this.server.assetsManager.getData(path.join('maps', _path), readType);
    }

    public getMapsData(_path: string, readType?: ReadType) {
        return this.getData(path.join('maps', _path), readType);
    }

    public getLibraries(): IMapLibrary[] {
        return this.getData('libraries.json');
    }

    public findMap(name: string, theme: ThemeType = Theme.SUMMER) {

        const loaded = this.loadedMaps.find(map => map.getName() === name && map.getTheme() === theme);
        if (loaded) {
            return loaded;
        }

        const data = this.data.maps.find(map => (map.mapId === name && map.theme === theme))

        if (!data) {
            Logger.error(`Map ${name} with theme ${theme} not found`);
            return null;
        }

        const map = new Map(this, data);
        this.loadedMaps.push(map);

        return map;
    }

    public getModeLimits(mode: string) {
        return this.data.battleLimits
            .find(limits => limits.battleMode === mode);
    }

    public sendMapsData(client: Player) {
        const setMapsDataPacket = new SetMapsDataPacket();
        setMapsDataPacket.data = this.data;
        client.sendPacket(setMapsDataPacket);
    }
}